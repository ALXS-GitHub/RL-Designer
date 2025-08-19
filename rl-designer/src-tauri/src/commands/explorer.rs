use crate::types::decal::DecalInfo;
use crate::types::elements::ElementType;
use crate::utils::explorer::fetch_decals_from_github_raw;

#[derive(Debug, serde::Serialize)]
pub struct GitHubDecalsResponse {
    success: bool,
    decals: Vec<DecalInfo>,
    error: Option<String>,
}

#[tauri::command]
pub async fn get_element_decals_from_github(element: ElementType) -> GitHubDecalsResponse {
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


