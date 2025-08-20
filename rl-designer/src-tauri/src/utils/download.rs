use crate::config::get_install_path;
use crate::constants::GITHUB_DECALS_RAW_URL;
use crate::types::decal::{DecalInfo, VariantInfo};
use crate::types::elements::ElementType;
use crate::utils::collection::read_preview_files_from_variant;
use crate::utils::explorer::fetch_decal_index;
use crate::utils::hash::calculate_folder_signature;
use crate::utils::files::read_files_from_folder;
use std::fs;



pub async fn download_decal_variant_logic(
    element: ElementType,
    decal_name: &str,
    variant_name: &str,
) -> Result<VariantInfo, String> {
    let (variant_info, decal_relative_path) = get_variant_from_index(element, decal_name, variant_name).await?;

    // Download each file
    let client = reqwest::Client::builder()
        .user_agent("RL-Designer-App/1.0")
        .timeout(std::time::Duration::from_secs(3))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    // Get the installation path
    let install_path =
        get_install_path(element).map_err(|e| format!("Failed to get install path: {}", e))?;

    // Create decal directory if it doesn't exist
    let decal_dir = install_path.join(decal_name);
    if !decal_dir.exists() {
        fs::create_dir(&decal_dir).map_err(|e| {
            format!(
                "Failed to create decal directory '{}': {}",
                decal_dir.display(),
                e
            )
        })?;
    }

    // Create variant directory (remove if exists, then create)
    let variant_dir = decal_dir.join(variant_name);
    if variant_dir.exists() {
        fs::remove_dir_all(&variant_dir).map_err(|e| {
            format!(
                "Failed to remove existing variant directory '{}': {}",
                variant_dir.display(),
                e
            )
        })?;
    }

    fs::create_dir(&variant_dir).map_err(|e| {
        format!(
            "Failed to create variant directory '{}': {}",
            variant_dir.display(),
            e
        )
    })?;

    // Download each file
    for filename in &variant_info.files {
        let file_url = get_decal_file_url(element, decal_relative_path.as_ref(), decal_name, variant_name, filename);
        let file_path = variant_dir.join(filename);

        // Download the file
        let response = client
            .get(&file_url)
            .send()
            .await
            .map_err(|e| format!("Failed to download file '{}': {}", filename, e))?;

        if !response.status().is_success() {
            return Err(format!(
                "Failed to download file '{}': {} - {}",
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

    println!(
        "Successfully downloaded decal '{}' variant '{}'",
        decal_name, variant_name
    );

    // Read the body diffuse from the variant
    let preview_files = read_preview_files_from_variant(element, &decal_dir, &variant_name).ok();
    let variant_files = read_files_from_folder(&variant_dir).unwrap_or_default();
    Ok(VariantInfo {
        variant_name: variant_name.to_string(),
        signature: calculate_folder_signature(&variant_dir).unwrap_or_default(),
        files: variant_files,
        preview_path: preview_files
            .as_ref()
            .and_then(|pf| pf.preview_path.clone()),
        skin_path: preview_files.as_ref().and_then(|pf| pf.skin_path.clone()),
        chassis_diffuse_path: preview_files
            .as_ref()
            .and_then(|pf| pf.chassis_diffuse_path.clone()),
        one_diffuse_skin_path: preview_files
            .as_ref()
            .and_then(|pf| pf.one_diffuse_skin_path.clone()),
        imageseq_subuv_path: preview_files
            .as_ref()
            .and_then(|pf| pf.imageseq_subuv_path.clone()),
    })
}

// Helper function for downloading decal files (for future use)
pub fn get_decal_file_url(
    element: ElementType,
    relative_path: Option<&String>,
    decal_name: &str,
    variant_name: &str,
    filename: &str,
) -> String {
    match relative_path {
        Some(rel_path) => format!(
            "{}/{}/{}/{}/{}/{}",
            GITHUB_DECALS_RAW_URL,
            element.get_git_folder_name(),
            urlencoding::encode(&rel_path),
            urlencoding::encode(decal_name),
            urlencoding::encode(variant_name),
            urlencoding::encode(filename)
        ),
        None => format!(
            "{}/{}/{}/{}/{}",
            GITHUB_DECALS_RAW_URL,
            element.get_git_folder_name(),
            urlencoding::encode(decal_name),
            urlencoding::encode(variant_name),
            urlencoding::encode(filename)
        ),
    }
}

pub async fn get_variant_from_index(
    element_type: ElementType, 
    decal_name: &str,
    variant_name: &str,
) -> Result<(VariantInfo, Option<String>), String> {
    // Fetch the decals index
    let decals_index = fetch_decal_index(element_type).await?;

    // Find the decal by name
    let decal_info = decals_index
        .decals
        .iter()
        .find(|d| d.name == decal_name)
        .ok_or_else(|| format!("Decal '{}' not found", decal_name))?;

    // Find the variant by name
    let variant_info = decal_info
        .variants
        .iter()
        .find(|v| v.variant_name == variant_name)
        .cloned()
        .ok_or_else(|| {
            format!(
                "Variant '{}' not found for decal '{}'",
                variant_name, decal_name
            )
        })?;

    Ok((variant_info, decal_info.relative_path.clone()))
}