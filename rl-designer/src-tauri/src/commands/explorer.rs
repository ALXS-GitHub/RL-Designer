use crate::utils::explorer::{fetch_decals_from_github_raw};
use crate::types::decal::DecalTextures;

#[derive(Debug, serde::Serialize)]
pub struct GitHubDecalsResponse {
    success: bool,
    decals: Vec<DecalTextures>,
    error: Option<String>,
}

#[tauri::command]
pub async fn get_decals_from_github() -> GitHubDecalsResponse {
    match fetch_decals_from_github_raw().await {
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