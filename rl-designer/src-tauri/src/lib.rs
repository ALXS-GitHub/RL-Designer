pub mod config;
pub mod constants;
pub mod utils;
pub mod types;
pub mod commands;

use crate::commands::collection::{get_decal_texture_folders, remove_decal_variant};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })

    .invoke_handler(tauri::generate_handler![
      get_decal_texture_folders,
      remove_decal_variant
    ])

    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
