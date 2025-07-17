use std::fs;
use std::path::{Path, PathBuf};
use base64::{engine::general_purpose, Engine};

#[deprecated(
    note = "We are using Asset Protocol to serve images, this function is deprecated and will be removed in future versions."
)]
pub async fn get_image_data(path: PathBuf) -> Result<String, String> {
    // Read the image file
    let data = fs::read(&path).map_err(|e| e.to_string())?;
    
    // Get the MIME type based on extension
    let mime_type = match Path::new(&path).extension().and_then(|ext| ext.to_str()) {
        Some(ext) => match ext.to_lowercase().as_str() {
            "jpg" | "jpeg" => "image/jpeg",
            "png" => "image/png",
            "gif" => "image/gif",
            "webp" => "image/webp",
            _ => "application/octet-stream",
        },
        None => "application/octet-stream",
    };
    
    // Convert to base64
    let base64 = general_purpose::STANDARD.encode(&data);
    
    // Create data URL
    let data_url = format!("data:{};base64,{}", mime_type, base64);
    
    Ok(data_url)
}