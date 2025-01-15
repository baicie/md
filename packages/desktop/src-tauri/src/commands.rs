use serde_json::json;
use tauri::{Manager, Theme};
use tauri_plugin_store::StoreExt;

use crate::constant::THEME_KEY;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub async fn toggle_theme(app: tauri::AppHandle, theme: Theme) -> Result<(), String> {
    // 获取主窗口
    let window = app.get_webview_window("main").unwrap();

    // 设置主题
    window.set_theme(Some(theme)).map_err(|e| e.to_string())?;

    // 保存到 store
    let store = app.store("app_state").unwrap();
    store.set(THEME_KEY, json!({ "value": theme }));
    store.save().map_err(|e| e.to_string())?;

    Ok(())
}
