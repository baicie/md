use tauri::Builder;

pub fn init_plugins<R: tauri::Runtime>(builder: Builder<R>) -> Builder<R> {
    builder
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
}
