use crate::types::decal::DecalTextures;
use crate::utils::explorer::fetch_decals_from_github_raw;
use crate::types::elements::ElementType;

#[derive(Debug, serde::Serialize)]
pub struct GitHubDecalsResponse {
    success: bool,
    decals: Vec<DecalTextures>,
    error: Option<String>,
}

async fn fetch_decal_from_github_element_logic(element: ElementType) -> GitHubDecalsResponse {
    match fetch_decals_from_github_raw(element).await {
        Ok(decals) => GitHubDecalsResponse {
            success: true,
            decals,
            error: None,
        },
        Err(e) => GitHubDecalsResponse {
            success: false,
            decals: Vec::new(),
            error: Some(e),
        },
    }
}

#[tauri::command]
pub async fn get_car_decals_from_github() -> GitHubDecalsResponse {
    fetch_decal_from_github_element_logic(ElementType::Car).await
}

#[tauri::command]
pub async fn get_ball_decals_from_github() -> GitHubDecalsResponse {
    fetch_decal_from_github_element_logic(ElementType::Ball).await
}