use crate::config::get_install_path;
use crate::types::decal::DecalTextures;
use serde_json::Value;
use std::fs;
use crate::types::elements::ElementType;

pub fn fetch_decal_folders(element: ElementType) -> Result<Vec<DecalTextures>, String> {
    // Get the AppData environment variable
    let install_path =
        get_install_path(element).map_err(|e| format!("Failed to get install path: {}", e))?;

    // Check if the install path exists
    if !install_path.exists() {
        return Err("Install path does not exist. Make sure BakkesMod is installed and ACPlugin is installed and enabled.".to_string());
    }

    // Read the directory and collect subfolder names
    let entries =
        fs::read_dir(install_path).map_err(|e| format!("Failed to read directory: {}", e))?;

    let mut folders = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        // Check if it's a directory and add its name to the list
        if path.is_dir() {
            let name = path
                .file_name()
                .and_then(|n| n.to_str())
                .map(|s| s.to_string());
            if name.is_none() {
                continue;
            };
            let name = name.unwrap();

            let variants = fs::read_dir(&path)
                .map_err(|e| format!("Failed to read subdirectory: {}", e))?
                .filter_map(|v| {
                    v.ok().and_then(|v_entry| {
                        v_entry
                            .path()
                            .file_name()
                            .and_then(|n| n.to_str())
                            .map(|s| s.to_string())
                    })
                })
                .collect::<Vec<String>>();

            // Skip if no variants found
            if variants.is_empty() {
                continue;
            }

            let mut decal = DecalTextures {
                name: name.clone(),
                variants: variants.clone(),
                ..DecalTextures::default()
            };

            if let Some(first_variant) = variants.first() {
                let body_diffuse = read_body_diffuse_from_variant(element, &path, first_variant);
                if let Ok(diffuse) = body_diffuse {
                    decal.preview_path = Some(diffuse);
                }
            }

            folders.push(decal);
        }
    }

    // Sort folders alphabetically for consistent results
    folders.sort();

    Ok(folders)
}

pub fn read_body_diffuse_from_variant(
    element: ElementType,
    decal_path: &std::path::Path,
    variant_name: &str,
) -> Result<String, String> {
    let variant_path = decal_path.join(variant_name);

    // Look for JSON files in the variant directory
    let entries = fs::read_dir(&variant_path)
        .map_err(|e| format!("Failed to read variant directory: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read variant entry: {}", e))?;
        let file_path = entry.path();

        if file_path.extension().and_then(|ext| ext.to_str()) == Some("json") {
            // Read and parse the JSON file
            let json_content = fs::read_to_string(&file_path)
                .map_err(|e| format!("Failed to read JSON file: {}", e))?;

            let json_value: Value = serde_json::from_str(&json_content)
                .map_err(|e| format!("Failed to parse JSON: {}", e))?;

            // Extract body diffuse from any top-level key
            if let Some(obj) = json_value.as_object() {
                for (_, value) in obj {
                    if let Some(body) = value.get(element.get_body_diffuse().body.as_str()) {
                        if let Some(diffuse) = body.get(element.get_body_diffuse().diffuse.as_str()) {
                            if let Some(diffuse_filename) = diffuse.as_str() {
                                // Build the full path to the diffuse image
                                let diffuse_path = variant_path.join(diffuse_filename);

                                // Check if the file actually exists
                                if diffuse_path.exists() {
                                    // Return the full path as string for asset serving
                                    return Ok(diffuse_path.to_string_lossy().to_string());
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Err("No body diffuse file found".to_string())
}

pub fn remove_decal_variant_logic(element: ElementType, decal_name: &str, variant_name: &str) -> Result<(), String> {
    let install_path =
        get_install_path(element).map_err(|e| format!("Failed to get install path: {}", e))?;

    let decal_path = install_path.join(&decal_name);
    let variant_path = decal_path.join(&variant_name);

    // Check if the decal and variant exist
    if !decal_path.exists() || !variant_path.exists() {
        return Err("Decal or variant does not exist".to_string());
    }

    // Remove the variant directory
    fs::remove_dir_all(variant_path)
        .map_err(|e| format!("Failed to remove decal variant: {}", e))?;

    // if the decal directory is empty after removing the variant, remove it as well
    if fs::read_dir(decal_path.clone())
        .map_err(|e| format!("Failed to read decal directory: {}", e))?
        .next()
        .is_none()
    {
        fs::remove_dir(decal_path)
            .map_err(|e| format!("Failed to remove decal directory: {}", e))?;
    }

    Ok(())
}
