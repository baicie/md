// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rust_i18n::set_locale;

fn main() {
    // 设置默认语言为中文
    set_locale("zh-CN");

    desktop_lib::run()
}
