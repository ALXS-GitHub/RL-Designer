use std::{fs, path::PathBuf};
use serde_json::{Value, Map};

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

pub fn get_file_from_pattern(json_object: &Map<String, Value>, pattern: Value) -> Option<String> {

    // make sure pattern is String or Option<String>
    let pattern = match pattern {
        Value::String(s) => Some(s),
        Value::Null => None,
        _ => None,
    };

    if pattern.is_none() {
        return None;
    }

    if let Some(pattern) = pattern {

        let mut keys = pattern.split(".").collect::<Vec<&str>>();
        if keys.is_empty() {
            return None;
        }
        let last_key = keys.pop().unwrap();
        let mut current = json_object;

        for key in keys {
            // if current is object and that key is in current
            if let Some(next) = current.get(key).and_then(|v| v.as_object()) {
                current = next;
            } else {
                return None;
            }
        }

        return current.get(last_key).and_then(|v| v.as_str()).map(|s| s.to_string());

    }
    None
}