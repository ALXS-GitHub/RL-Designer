use crate::config::get_install_path;
use crate::types::decal::{DecalInfo, VariantInfo};
use crate::types::elements::ElementType;
use crate::utils::files::{read_files_from_folder, read_folders_from_folder};
use crate::utils::hash::calculate_folder_signature;
use serde_json::Value;
use std::fs;

pub fn fetch_decal_folders(element: ElementType) -> Result<Vec<DecalInfo>, String> {
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

            let variants = read_folders_from_folder(&path)
                .map_err(|e| format!("Failed to read subdirectory: {}", e))?;

            // Skip if no variants found
            if variants.is_empty() {
                continue;
            }

            // TODO : do a function that maps this automatically
            let mut variants_with_preview: Vec<VariantInfo> = Vec::new();
            for variant_name in variants {
                let variant_path = path.join(&variant_name);
                let variant_files = read_files_from_folder(&variant_path)?;

                let preview_files =
                    read_preview_files_from_variant(element, &path, &variant_name).ok();
                variants_with_preview.push(VariantInfo {
                    variant_name: variant_name.clone(),
                    files: variant_files.clone(),
                    signature: calculate_folder_signature(&variant_path).unwrap_or_default(),
                    preview_path: preview_files
                        .as_ref()
                        .and_then(|pf| pf.preview_path.clone()),
                    skin_path: preview_files.as_ref().and_then(|pf| pf.skin_path.clone()),
                    chassis_diffuse_path: preview_files
                        .as_ref()
                        .and_then(|pf| pf.chassis_diffuse_path.clone()),
                    one_diffuse_skin_path: preview_files.as_ref().and_then(|pf| pf.one_diffuse_skin_path.clone()),
                });
            }

            let decal = DecalInfo {
                name: name.clone(),
                variants: variants_with_preview,
            };

            folders.push(decal);
        }
    }

    // Sort folders alphabetically for consistent results
    folders.sort();

    Ok(folders)
}

pub struct PreviewFiles {
    pub preview_path: Option<String>,
    pub skin_path: Option<String>,
    pub chassis_diffuse_path: Option<String>,
    pub one_diffuse_skin_path: Option<String>,
}

pub fn read_preview_files_from_variant(
    element: ElementType,
    decal_path: &std::path::Path,
    variant_name: &str,
) -> Result<PreviewFiles, String> {
    let variant_path = decal_path.join(variant_name);
    let mut preview_files = PreviewFiles {
        preview_path: None,
        skin_path: None,
        chassis_diffuse_path: None,
        one_diffuse_skin_path: None,
    };

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
                        let diffuse_path = body
                            .get(element.get_body_diffuse().diffuse.as_str())
                            .and_then(|d| d.as_str())
                            .map(|s| variant_path.join(s).to_string_lossy().to_string());
                        let skin_path = body
                            .get(element.get_body_diffuse().skin.as_str())
                            .and_then(|s| s.as_str())
                            .map(|s| variant_path.join(s).to_string_lossy().to_string());
                        let one_diffuse_skin_path = body
                            .get(element.get_body_diffuse().one_diffuse_skin.as_str())
                            .and_then(|s| s.as_str())
                            .map(|s| variant_path.join(s).to_string_lossy().to_string());

                        // Check if diffuse_path exists, if not set to None
                        let diffuse_path = diffuse_path.and_then(|path| {
                            let path_obj = std::path::Path::new(&path);
                            if path_obj.exists() {
                                Some(path)
                            } else {
                                None
                            }
                        });
                        preview_files.preview_path = diffuse_path;

                        // Check if skin_path exists, if not set to None
                        let skin_path = skin_path.and_then(|path| {
                            let path_obj = std::path::Path::new(&path);
                            if path_obj.exists() {
                                Some(path)
                            } else {
                                None
                            }
                        });
                        preview_files.skin_path = skin_path;

                        // Check if one_diffuse_skin_path exists, if not set to None
                        let one_diffuse_skin_path = one_diffuse_skin_path.and_then(|path| {
                            let path_obj = std::path::Path::new(&path);
                            if path_obj.exists() {
                                Some(path)
                            } else {
                                None
                            }
                        });
                        preview_files.one_diffuse_skin_path = one_diffuse_skin_path;

                    }
                    if let Some(chassis) = value.get(element.get_chassis_diffuse().chassis.as_str())
                    {
                        let chassis_diffuse_path = chassis
                            .get(element.get_chassis_diffuse().diffuse.as_str())
                            .and_then(|d| d.as_str())
                            .map(|s| variant_path.join(s).to_string_lossy().to_string());

                        // Check if chassis_diffuse_path exists, if not set to None
                        let chassis_diffuse_path = chassis_diffuse_path.and_then(|path| {
                            let path_obj = std::path::Path::new(&path);
                            if path_obj.exists() {
                                Some(path)
                            } else {
                                None
                            }
                        });
                        preview_files.chassis_diffuse_path = chassis_diffuse_path;
                    }
                }
                return Ok(preview_files);
            }
        }
    }

    Err("No body diffuse file found".to_string())
}

pub fn remove_decal_variant_logic(
    element: ElementType,
    decal_name: &str,
    variant_name: &str,
) -> Result<(), String> {
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
