import xxhash
import os
from pathlib import Path
from typing import List, Optional

def calculate_file_hash(file_path: Path) -> str:
    """
    Calculate SHA-256 hash of a single file.
    
    Args:
        file_path: Path to the file
        
    Returns:
        Hexadecimal string representation of the hash
        
    Raises:
        ValueError: If the file cannot be read or does not exist
        IOError: If there is an error reading the file
    """
    
    try:
        with open(file_path, "rb") as f:
            data = f.read()
        return f"{xxhash.xxh3_64(data).intdigest():016x}"
    except (IOError, OSError) as e:
        raise ValueError(f"Error reading file {file_path}: {e}")

def calculate_variant_signature(variant_path: Path) -> str:
    """
    Calculate a signature hash for all files in a variant directory.
    
    The signature is created by:
    1. Sorting filenames alphabetically (for consistency)
    2. For each file: concatenating filename + ":" + file_hash
    3. Hashing the concatenated string
    
    This ensures the same signature across different platforms and languages.
    
    Args:
        variant_path: Path to the variant directory
        files: List of filenames in the variant
        
    Returns:
        Hexadecimal string representation of the variant signature
        
    Raises:
        FileNotFoundError: If any file in the list does not exist
        ValueError: If a file cannot be hashed
    """
    
    files: List[str] = []
    subfolders: List[str] = []
    for file_path in sorted(variant_path.iterdir()):
        if file_path.is_file():
            files.append(file_path.name)
        elif file_path.is_dir():
            subfolders.append(file_path.name)

    if not files and not subfolders:
        return ""
    
    # Sort files for consistent ordering
    sorted_files = sorted(files)
    sorted_subfolders = sorted(subfolders)
    
    # Create signature string
    signature_parts = []
    
    for filename in sorted_files:
        file_path = variant_path / filename
        
        if file_path.exists() and file_path.is_file():
            try:
                file_hash = calculate_file_hash(file_path)
                signature_parts.append(f"{filename}:{file_hash}")
            except ValueError as e:
                raise ValueError(f"Failed to hash file {filename} in {variant_path}: {e}")
        else:
            raise FileNotFoundError(f"File {filename} not found in {variant_path}")

    for subfolder in sorted_subfolders:
        subfolder_path = variant_path / subfolder
        
        if subfolder_path.exists() and subfolder_path.is_dir():
            try:
                subfolder_signature = calculate_variant_signature(subfolder_path)
                signature_parts.append(f"{subfolder}:{subfolder_signature}")
            except ValueError as e:
                raise ValueError(f"Failed to hash subfolder {subfolder} in {variant_path}: {e}")
        else:
            raise FileNotFoundError(f"Subfolder {subfolder} not found in {variant_path}")

    if not signature_parts:
        return ""
    
    # Create final signature by hashing all file signatures
    combined_signature = "|".join(signature_parts)
    return f"{xxhash.xxh3_64(combined_signature.encode('utf-8')).intdigest():016x}"