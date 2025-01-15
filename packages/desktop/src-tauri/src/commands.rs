use serde_json::json;
use tauri::{Manager, Theme};
use tauri_plugin_store::StoreExt;

use crate::constant::THEME_KEY;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
