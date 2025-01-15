pub fn setup(app: &tauri::App) {
    crate::theme::init_theme(app);
}
