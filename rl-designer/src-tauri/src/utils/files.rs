use std::{fs, path::PathBuf};

pub fn read_files_from_folder(folder_path: &PathBuf) -> Result<Vec<String>, String> {
    let mut files = Vec::new();

    let entries = fs::read_dir(folder_path).map_err(|e| format!("Failed to read directory: {}", e))?;
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        if path.is_file() {
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                // push full path
                files.push(folder_path.join(name).to_string_lossy().to_string());
            }
        }
    }

    Ok(files)
}

pub fn read_folders_from_folder(
    folder_path: &PathBuf,
) -> Result<Vec<String>, String> {
    let mut folders = Vec::new();

    let entries = fs::read_dir(folder_path).map_err(|e| format!("Failed to read directory: {}", e))?;
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        if path.is_dir() {
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                folders.push(name.to_string());
            }
        }
    }

    Ok(folders)
}

// TODO : maybe do a function that get folders and files (as json map of folders and files)