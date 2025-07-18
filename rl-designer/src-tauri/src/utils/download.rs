use crate::utils::explorer::fetch_decal_index;
use crate::constants::GITHUB_DECALS_RAW_URL;
use crate::config::get_install_path;
use std::fs;

pub async fn download_decal_variant_logic(decal_name: &str, variant_name: &str) -> Result<(), String> {
    // Get the list of files for the specified decal and variant
    let decals_index = fetch_decal_index().await?;
    let decal_info = decals_index.decals.iter()
        .find(|d| d.name == decal_name)
        .ok_or_else(|| format!("Decal '{}' not found", decal_name))?;

    let variant_info = decal_info.variants.iter()
        .find(|v| v.variant == variant_name)
        .ok_or_else(|| format!("Variant '{}' not found for decal '{}'", variant_name, decal_name))?;

    // Download each file
    let client = reqwest::Client::builder()
        .user_agent("RL-Designer-App/1.0")
        .timeout(std::time::Duration::from_secs(3))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    // Get the installation path
    let install_path = get_install_path()
        .map_err(|e| format!("Failed to get install path: {}", e))?;

    // Create decal directory if it doesn't exist
    let decal_dir = install_path.join(decal_name);
    if !decal_dir.exists() {
        fs::create_dir(&decal_dir)
            .map_err(|e| format!("Failed to create decal directory '{}': {}", decal_dir.display(), e))?;
    }

    // Create variant directory (remove if exists, then create)
    let variant_dir = decal_dir.join(variant_name);
    if variant_dir.exists() {
        fs::remove_dir_all(&variant_dir)
            .map_err(|e| format!("Failed to remove existing variant directory '{}': {}", variant_dir.display(), e))?;
    }
    
    fs::create_dir(&variant_dir)
        .map_err(|e| format!("Failed to create variant directory '{}': {}", variant_dir.display(), e))?;

    // Download each file
    for filename in &variant_info.files {
        let file_url = get_decal_file_url(decal_name, variant_name, filename);
        let file_path = variant_dir.join(filename);

        // Download the file
        let response = client
            .get(&file_url)
            .send()
            .await
            .map_err(|e| format!("Failed to download file '{}': {}", filename, e))?;

        if !response.status().is_success() {
            return Err(format!("Failed to download file '{}': {} - {}", 
                filename, 
                response.status(), 
                response.text().await.unwrap_or_default()
            ));
        }

        // Get the file content
        let file_content = response
            .bytes()
            .await
            .map_err(|e| format!("Failed to read file content for '{}': {}", filename, e))?;

        // Write the file to disk
        fs::write(&file_path, file_content)
            .map_err(|e| format!("Failed to write file '{}': {}", file_path.display(), e))?;

        println!("Downloaded: {}", filename);
    }

    println!("Successfully downloaded decal '{}' variant '{}'", decal_name, variant_name);
    Ok(())
}

// Helper function for downloading decal files (for future use)
pub fn get_decal_file_url(decal_name: &str, variant_name: &str, filename: &str) -> String {
    format!(
        "{}/decals/{}/{}/{}",
        GITHUB_DECALS_RAW_URL,
        urlencoding::encode(decal_name),
        urlencoding::encode(variant_name),
        urlencoding::encode(filename)
    )
}