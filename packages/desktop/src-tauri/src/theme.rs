use serde_json::json;
use tauri::{Manager, Theme};
use tauri_plugin_store::StoreExt;

use crate::constant::{BASIC_STORE_NAME, THEME_KEY};

pub fn init_theme(app: &tauri::App) {
    let store = app.store(BASIC_STORE_NAME).unwrap();

    if let Some(theme) = store.get(THEME_KEY) {
        if let Some(theme_value) = theme.get("value").and_then(|v| v.as_str()) {
            let window = app.get_webview_window("main").unwrap();
            window.set_theme(Some(get_theme(theme_value))).unwrap();
        }
    }
}

#[tauri::command]
pub async fn toggle_theme(app: tauri::AppHandle, theme: Theme) -> Result<(), String> {
    let window = app.get_webview_window("main").unwrap();
    window.set_theme(Some(theme)).map_err(|e| e.to_string())?;

    let store = app.store(BASIC_STORE_NAME).unwrap();
    store.set(THEME_KEY, json!({ "value": theme }));
    store.save().map_err(|e| e.to_string())?;

    Ok(())
}

fn get_theme(theme: &str) -> Theme {
    match theme {
        "light" => Theme::Light,
        "dark" => Theme::Dark,
        _ => Theme::Dark,
    }
}
