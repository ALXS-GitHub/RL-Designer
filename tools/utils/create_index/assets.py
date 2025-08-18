from pathlib import Path
import json
from models.create_index.assets import AssetsPaths
from typing import List

def get_file_from_pattern(json_object, pattern: str | None) -> str | None:
    """
    Extracts a file path from a JSON object based on a given pattern, by recursively splitting the pattern on "."
    """
    if pattern is None:
        return None

    keys = pattern.split(".")
    current = json_object
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return None
    return current if isinstance(current, str) else None


def get_assets_paths(config, texture_folder: Path, variant_name: str, files: List[str]) -> AssetsPaths:
    """
    Extract preview path and skin path from a variant by reading JSON files
    and looking for Body.Diffuse field (or Ball.Diffuse, Wheel.Diffuse for other types)
    and corresponding Skin fields

    Args:
        texture_folder: Path to the texture folder
        variant_name: Name of the variant folder
        files: List of files in the variant folder

    Returns:
        AssetsPaths: An instance of AssetsPaths containing the extracted paths
    """

    # Find the first JSON file
    json_files = [f for f in files if f.endswith('.json')]
    if not json_files:
        return AssetsPaths()

    json_file = json_files[0]
    json_path = texture_folder / variant_name / json_file

    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        assets_paths = AssetsPaths()
        
        for value in json_data.values():
            if isinstance(value, dict):
                json_data = value
                break

        for pattern_key, pattern_value in config['patterns'].items():
            
            file_path = get_file_from_pattern(json_data, pattern_value)
            if file_path and file_path in files:
                if pattern_key == "diffuse_pattern":
                    assets_paths.preview_path = file_path
                elif pattern_key == "skin_pattern":
                    assets_paths.skin_path = file_path
                elif pattern_key == "chassis_diffuse_pattern":
                    assets_paths.chassis_diffuse_path = file_path
                elif pattern_key == "one_diffuse_skin_pattern":
                    assets_paths.one_diffuse_skin_path = file_path

        return assets_paths

    except json.JSONDecodeError as e:
        print(f"    ❌ Error parsing JSON {json_file} for {variant_name}: {e}")
        return AssetsPaths()
    except FileNotFoundError:
        print(f"    ❌ JSON file not found: {json_path}")
        return AssetsPaths()
    except Exception as e:
        print(f"    ❌ Error reading {json_file} for {variant_name}: {e}")
        return AssetsPaths()