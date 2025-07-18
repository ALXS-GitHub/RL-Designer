use crate::utils::download::download_decal_variant_logic;

#[derive(Debug, serde::Serialize)]
pub struct DownloadResponse {
    success: bool,
    message: String,
    error: Option<String>,
}

#[tauri::command]
pub async fn download_decal_variant(decal_name: String, variant_name: String) -> DownloadResponse {
    match download_decal_variant_logic(&decal_name, &variant_name).await {
        Ok(()) => DownloadResponse {
            success: true,
            message: format!("Successfully downloaded '{}' variant '{}'", decal_name, variant_name),
            error: None,
        },
        Err(e) => DownloadResponse {
            success: false,
            message: format!("Failed to download '{}' variant '{}'", decal_name, variant_name),
            error: Some(e),
        },
    }
}