use crate::types::decal::VariantInfo;
use crate::types::elements::ElementType;
use crate::utils::download::download_decal_variant_logic;

#[derive(Debug, serde::Serialize)]
pub struct DownloadResponse {
    success: bool,
    message: String,
    error: Option<String>,
    variant_info: Option<VariantInfo>,
}

#[tauri::command]
pub async fn download_element_decal_variant(
    element: ElementType,
    decal_name: String,
    variant_name: String,
) -> DownloadResponse {
    match download_decal_variant_logic(element, &decal_name, &variant_name).await {
        Ok(variant_info) => DownloadResponse {
            success: true,
            message: format!(
                "Successfully downloaded '{}' variant '{}'",
                decal_name, variant_name
            ),
            variant_info: Some(variant_info),
            error: None,
        },
        Err(e) => DownloadResponse {
            success: false,
            message: format!(
                "Failed to download '{}' variant '{}'",
                decal_name, variant_name
            ),
            variant_info: None,
            error: Some(e),
        },
    }
}
