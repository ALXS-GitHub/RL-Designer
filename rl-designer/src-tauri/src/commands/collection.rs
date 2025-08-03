use crate::types::decal::DecalTextures;
use crate::types::elements::ElementType;
use crate::utils::collection::{fetch_decal_folders, remove_decal_variant_logic};

#[derive(Debug, serde::Serialize)]
pub struct FetchResult {
    success: bool,
    decals: Vec<DecalTextures>,
    error: Option<String>,
}

fn get_decal_texture_element_logic(element: ElementType) -> FetchResult {
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

#[tauri::command]
pub fn get_car_decal_texture_folder() -> FetchResult {
    get_decal_texture_element_logic(ElementType::Car)
}

#[tauri::command]
pub fn get_ball_decal_texture_folder() -> FetchResult {
    get_decal_texture_element_logic(ElementType::Ball)
}

#[derive(Debug, serde::Serialize)]
pub struct RemoveResult {
    success: bool,
    error: Option<String>,
}

fn remove_decal_variant_element_logic(
    element: ElementType,
    decal_name: &str,
    variant_name: &str,
) -> RemoveResult {
    match remove_decal_variant_logic(element, decal_name, variant_name) {
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

#[tauri::command]
pub fn remove_car_decal_variant(decal_name: String, variant_name: String) -> RemoveResult {
    remove_decal_variant_element_logic(ElementType::Car, &decal_name, &variant_name)
}

#[tauri::command]
pub fn remove_ball_decal_variant(decal_name: String, variant_name: String) -> RemoveResult {
    remove_decal_variant_element_logic(ElementType::Ball, &decal_name, &variant_name)
}
