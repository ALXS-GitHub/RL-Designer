use crate::types::decal::DecalTextures;
use crate::utils::collection::{fetch_decal_folders, remove_decal_variant_logic};

#[derive(Debug, serde::Serialize)]
pub struct FetchResult {
    success: bool,
    decals: Vec<DecalTextures>,
    error: Option<String>,
}

#[tauri::command]
pub fn get_decal_texture_folders() -> FetchResult {
    match fetch_decal_folders() {
        Ok(decals) => FetchResult {
            success: true,
            decals,
            error: None,
        },
        Err(error) => FetchResult {
            success: false,
            decals: vec![],
            error: Some(error),
        },
    }
}

#[derive(Debug, serde::Serialize)]
pub struct RemoveResult {
    success: bool,
    error: Option<String>,
}

#[tauri::command]
pub fn remove_decal_variant(decal_name: String, variant_name: String) -> RemoveResult {
    // Implement the logic to remove a decal variant
    match remove_decal_variant_logic(&decal_name, &variant_name) {
        Ok(_) => RemoveResult {
            success: true,
            error: None,
        },
        Err(error) => RemoveResult {
            success: false,
            error: Some(error),
        },
    }
}
