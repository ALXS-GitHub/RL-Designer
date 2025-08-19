use crate::types::decal::DecalInfo;
use crate::types::elements::ElementType;
use crate::utils::collection::{fetch_decal_folders, remove_decal_variant_logic};

#[derive(Debug, serde::Serialize)]
pub struct FetchResult {
    success: bool,
    decals: Vec<DecalInfo>,
    error: Option<String>,
}

#[tauri::command]
pub fn get_element_decal_texture_folder(element: ElementType) -> FetchResult {
    match fetch_decal_folders(element) {
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
pub fn remove_element_decal_variant(
    element: ElementType,
    decal_name: String,
    variant_name: String,
) -> RemoveResult {
    match remove_decal_variant_logic(element, &decal_name, &variant_name) {
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
