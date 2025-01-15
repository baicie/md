use crate::constant::{BASIC_STORE_NAME, THEME_KEY};
use serde_json::{json, Value};
use tauri::Manager;
use tauri_plugin_store::StoreExt;

pub fn setup(app: &tauri::App) {
    let store = app.store(BASIC_STORE_NAME).unwrap();

    if let Some(theme) = store.get(THEME_KEY) {
        println!("Stored theme: {:?}", theme);
        let window = app.get_webview_window("main").unwrap();

        // 从 JSON 对象中获取 theme 值
        if let Some(theme_value) = theme.get("value").and_then(|v| v.as_str()) {
            window.set_theme(Some(get_theme(theme_value))).unwrap();
        }
    }
}

fn get_theme(theme: &str) -> tauri::Theme {
    match theme {
        "light" => tauri::Theme::Light,
        "dark" => tauri::Theme::Dark,
        _ => tauri::Theme::Dark,
    }
}
