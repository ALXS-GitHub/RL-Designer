use crate::config::get_install_path;
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use tokio::io::AsyncWriteExt;

#[derive(Debug, serde::Serialize)]
pub struct InstallBallPatchResponse {
    success: bool,
    message: String,
    error: Option<String>,
}

#[tauri::command]
pub async fn install_ball_patch() -> InstallBallPatchResponse {
    match download_and_install_ball_patch().await {
        Ok(_) => InstallBallPatchResponse {
            success: true,
            message: "Ball patch installed successfully".to_string(),
            error: None,
        },
        Err(e) => InstallBallPatchResponse {
            success: false,
            message: "Failed to install ball patch".to_string(),
            error: Some(e),
        },
    }
}

pub async fn download_and_install_ball_patch() -> Result<(), String> {
    // Get the patch URL from environment variable
    let patch_url = crate::constants::ONLINE_BALL_DECAL_PATCH_RELEASE_URL;

    println!("Starting ball patch download from: {}", patch_url);

    // Create HTTP client
    let client = reqwest::Client::builder()
        .user_agent("RL-Designer-App/1.0")
        .timeout(std::time::Duration::from_secs(60)) // Longer timeout for larger files
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    // Get a temporary directory for download and extraction
    let temp_dir = std::env::temp_dir().join("rl-designer-ball-patch");
    if temp_dir.exists() {
        fs::remove_dir_all(&temp_dir).map_err(|e| {
            format!(
                "Failed to clean temporary directory '{}': {}",
                temp_dir.display(),
                e
            )
        })?;
    }
    fs::create_dir_all(&temp_dir).map_err(|e| {
        format!(
            "Failed to create temporary directory '{}': {}",
            temp_dir.display(),
            e
        )
    })?;

    // Download the zip file
    let zip_path = temp_dir.join("ball_patch.zip");
    println!("Downloading to: {}", zip_path.display());

    let response = client
        .get(patch_url)
        .send()
        .await
        .map_err(|e| format!("Failed to download patch: {}", e))?;

    if !response.status().is_success() {
        return Err(format!(
            "Failed to download patch: {} - {}",
            response.status(),
            response.text().await.unwrap_or_default()
        ));
    }

    // Write the zip file
    let zip_content = response
        .bytes()
        .await
        .map_err(|e| format!("Failed to read download content: {}", e))?;

    let mut zip_file = tokio::fs::File::create(&zip_path)
        .await
        .map_err(|e| format!("Failed to create zip file: {}", e))?;

    zip_file
        .write_all(&zip_content)
        .await
        .map_err(|e| format!("Failed to write zip file: {}", e))?;

    println!("Download completed. Extracting...");

    // Extract the zip file
    let extract_dir = temp_dir.join("extracted");
    extract_zip(&zip_path, &extract_dir)?;

    println!("Extraction completed. Looking for install.bat...");

    // Find and run install.bat
    let install_bat_path = find_install_bat(&extract_dir)?;
    run_install_script(&install_bat_path)?;

    // Clean up temporary files
    println!("Cleaning up temporary files...");
    if let Err(e) = fs::remove_dir_all(&temp_dir) {
        eprintln!("Warning: Failed to clean up temporary directory: {}", e);
    }

    println!("Ball patch installation completed successfully!");
    Ok(())
}

fn extract_zip(zip_path: &Path, extract_dir: &Path) -> Result<(), String> {
    use std::fs::File;
    use zip::ZipArchive;

    // Create extraction directory
    fs::create_dir_all(extract_dir).map_err(|e| {
        format!(
            "Failed to create extraction directory '{}': {}",
            extract_dir.display(),
            e
        )
    })?;

    // Open and read the zip file
    let zip_file = File::open(zip_path)
        .map_err(|e| format!("Failed to open zip file '{}': {}", zip_path.display(), e))?;

    let mut archive =
        ZipArchive::new(zip_file).map_err(|e| format!("Failed to read zip archive: {}", e))?;

    // Extract each file
    for i in 0..archive.len() {
        let mut file = archive
            .by_index(i)
            .map_err(|e| format!("Failed to access file at index {}: {}", i, e))?;

        let file_path = extract_dir.join(file.name());

        // Create parent directories if needed
        if let Some(parent) = file_path.parent() {
            fs::create_dir_all(parent).map_err(|e| {
                format!(
                    "Failed to create parent directory '{}': {}",
                    parent.display(),
                    e
                )
            })?;
        }

        // Extract file
        if file.is_file() {
            let mut output_file = File::create(&file_path)
                .map_err(|e| format!("Failed to create file '{}': {}", file_path.display(), e))?;

            std::io::copy(&mut file, &mut output_file)
                .map_err(|e| format!("Failed to extract file '{}': {}", file_path.display(), e))?;

            println!("Extracted: {}", file.name());
        }
    }

    Ok(())
}

fn find_install_bat(extract_dir: &Path) -> Result<std::path::PathBuf, String> {
    // Look for install.bat in the extracted directory and subdirectories
    fn find_in_dir(dir: &Path, filename: &str) -> Option<std::path::PathBuf> {
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_file() && path.file_name().unwrap_or_default() == filename {
                    return Some(path);
                } else if path.is_dir() {
                    if let Some(found) = find_in_dir(&path, filename) {
                        return Some(found);
                    }
                }
            }
        }
        None
    }

    find_in_dir(extract_dir, "install.bat")
        .ok_or_else(|| "install.bat not found in the extracted files".to_string())
}

fn run_install_script(install_bat_path: &Path) -> Result<(), String> {
    println!("Running install script: {}", install_bat_path.display());

    // Get the directory containing the install.bat file
    let working_dir = install_bat_path
        .parent()
        .ok_or_else(|| "Failed to get install script directory".to_string())?;

    // Run the install.bat script
    let output = Command::new("cmd")
        .args(&["/C", install_bat_path.to_str().unwrap_or("")])
        .current_dir(working_dir)
        .output()
        .map_err(|e| format!("Failed to execute install script: {}", e))?;

    // Check if the command was successful
    if output.status.success() {
        println!("Install script executed successfully!");

        // Print stdout if available
        if !output.stdout.is_empty() {
            println!("Script output: {}", String::from_utf8_lossy(&output.stdout));
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);

        return Err(format!(
            "Install script failed with exit code: {}\nStdout: {}\nStderr: {}",
            output.status.code().unwrap_or(-1),
            stdout,
            stderr
        ));
    }

    Ok(())
}
