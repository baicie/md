use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use rust_i18n::t;

// 设置翻译文件目录
rust_i18n::i18n!("locales");

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
    .menu(|handle| Menu::with_items(handle, &[
        &Submenu::with_items(
          handle,
          t!("menu.file"),
          true,
          &[
            &PredefinedMenuItem::close_window(handle, None)?,
            #[cfg(target_os = "macos")]
            &MenuItem::new(handle, t!("menu.file"), true, None::<&str>)?,
          ],
        )?
      ]))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
