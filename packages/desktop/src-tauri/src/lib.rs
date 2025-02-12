mod commands;
mod constant;
mod plugins;
mod setup;
mod theme;

use commands::greet;
use plugins::init_plugins;
use rust_i18n::t;
use setup::setup;
use tauri::{menu::{Menu, MenuItem, PredefinedMenuItem, Submenu}, Manager};
use theme::toggle_theme;

// 设置翻译文件目录
rust_i18n::i18n!("locales");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();
    builder = init_plugins(builder);
    builder
        .setup(|app| {
            setup(app);
            Ok(())
        })
        .menu(|handle| {
            Menu::with_items(
                handle,
                &[&Submenu::with_items(
                    handle,
                    t!("menu.file"),
                    true,
                    &[
                        &PredefinedMenuItem::close_window(handle, None)?,
                        &MenuItem::new(handle, t!("menu.file"), true, None::<&str>)?,
                    ],
                )?],
            )
        })
        .invoke_handler(tauri::generate_handler![greet, toggle_theme])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
