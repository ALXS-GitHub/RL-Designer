// hash_utils.rs
use xxhash_rust::xxh3::xxh3_64;
use std::fs::{File, self};
use std::io::{self, Read};
use std::path::Path;

pub fn calculate_file_hash(file_path: &Path) -> io::Result<String> {
    let data = fs::read(file_path)?;
    let hash = xxh3_64(&data);
    Ok(format!("{:016x}", hash))
}

pub fn calculate_folder_signature(folder_path: &Path) -> io::Result<String> {
    let mut files: Vec<String> = Vec::new();
    let mut subfolders: Vec<String> = Vec::new();

    let read_dir = std::fs::read_dir(folder_path)?;
    for entry in read_dir {
        let entry = entry?;
        let path = entry.path();
       if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
            if path.is_file() {
                files.push(name.to_string());
            } else if path.is_dir() {
                subfolders.push(name.to_string());
            }
        }
    }

    if files.is_empty() && subfolders.is_empty() {
        return Ok(String::new());
    }
    
    files.sort();
    subfolders.sort();

    let mut signature_parts = Vec::new();

    for filename in files {
        let file_path = folder_path.join(&filename);

        match calculate_file_hash(&file_path) {
            Ok(file_hash) => {
                signature_parts.push(format!("{}:{}", filename, file_hash));
            }
            Err(e) => {
                eprintln!("Warning: Error hashing file {}: {}", filename, e);
            }
        }
    }

    for subfolder in subfolders {
        let subfolder_path = folder_path.join(&subfolder);
        match calculate_folder_signature(&subfolder_path) {
            Ok(subfolder_signature) => {
                signature_parts.push(format!("{}:{}", subfolder, subfolder_signature));
            }
            Err(e) => {
                eprintln!("Warning: Error hashing subfolder {}: {}", subfolder, e);
            }
        }
    }
    
    if signature_parts.is_empty() {
        return Ok(String::new());
    }
    
    let combined_signature = signature_parts.join("|");
    let hash = xxh3_64(combined_signature.as_bytes());
    Ok(format!("{:016x}", hash))
}