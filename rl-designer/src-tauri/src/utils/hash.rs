// hash_utils.rs
use xxhash_rust::xxh3::xxh3_64;
use std::fs::File;
use std::io::{self, Read};
use std::path::Path;

pub fn calculate_file_hash(file_path: &Path) -> io::Result<String> {
    let mut file = File::open(file_path)?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;
    
    let hash = xxh3_64(&buffer);
    Ok(format!("{:016x}", hash)) // 16-char hex string
}

pub fn calculate_folder_signature(folder_path: &Path) -> io::Result<String> {
    println!("Calculating for {:?}", folder_path);
    let mut files: Vec<String> = Vec::new();
    let mut subfolders: Vec<String> = Vec::new();

    let read_dir = std::fs::read_dir(folder_path)?;
    for entry in read_dir {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                files.push(name.to_string());
            }
        } else if path.is_dir() {
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                subfolders.push(name.to_string());
            }
        }
    }

    if files.is_empty() && subfolders.is_empty() {
        return Ok(String::new());
    }
    
    files.sort();
    subfolders.sort();
    let sorted_files: Vec<String> = files.into_iter().collect();
    let sorted_subfolders: Vec<String> = subfolders.into_iter().collect();

    let mut signature_parts = Vec::new();
    
    for filename in sorted_files {
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

    for subfolder in sorted_subfolders {
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