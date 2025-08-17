from pathlib import Path
import json
from models.create_index.assets import AssetsPaths
from typing import List

def get_assets_paths(texture_folder: Path, variant_name: str, files: List[str]) -> AssetsPaths:
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
        
        # Look for different diffuse and skin patterns based on texture type
        diffuse_patterns = ["Body.Diffuse", "Params.Diffuse", "Wheel.Diffuse"]
        skin_patterns = ["Body.Skin", "Params.Skin", "Wheel.Skin"]
        chassis_diffuse_patterns = ["Chassis.Diffuse"]
        one_diffuse_skin_patterns = ["Body.1_Diffuse_Skin", "Params.1_Diffuse_Skin", "Wheel.1_Diffuse_Skin"]

        assets_paths = AssetsPaths()
        
        # Look for any diffuse and skin field in any top-level key
        for key, value in json_data.items():
            if isinstance(value, dict):
                for i, diffuse_pattern in enumerate(diffuse_patterns):
                    skin_pattern = skin_patterns[i]  # Corresponding skin pattern
                    
                    if "." in diffuse_pattern:
                        # Nested pattern like "Body.Diffuse" and "Body.Skin"
                        parent_key, child_key = diffuse_pattern.split(".", 1)
                        _, skin_child_key = skin_pattern.split(".", 1)
                        _, one_diffuse_skin_child_key = one_diffuse_skin_patterns[i].split(".", 1)

                        if parent_key in value and isinstance(value[parent_key], dict):
                            # Check for diffuse
                            if child_key in value[parent_key]:
                                diffuse_filename = value[parent_key][child_key]
                                if diffuse_filename in files:
                                    assets_paths.preview_path = f"{diffuse_filename}"

                            # Check for skin in the same parent
                            if skin_child_key in value[parent_key]:
                                skin_filename = value[parent_key][skin_child_key]
                                if skin_filename in files:
                                    assets_paths.skin_path = f"{skin_filename}"

                            # Check for 1_Diffuse_Skin in the same parent
                            if one_diffuse_skin_child_key in value[parent_key]:
                                one_diffuse_skin_filename = value[parent_key][one_diffuse_skin_child_key]
                                if one_diffuse_skin_filename in files:
                                    assets_paths.one_diffuse_skin_path = f"{one_diffuse_skin_filename}"

                    # If we found a preview path, we can break (we found the right pattern)
                    if assets_paths.preview_path:
                        break
                
                for i, chassis_diffuse_pattern in enumerate(chassis_diffuse_patterns):
                    if "." in chassis_diffuse_pattern:
                        # Nested pattern like "Chassis.Diffuse"
                        parent_key, child_key = chassis_diffuse_pattern.split(".", 1)
                        
                        if parent_key in value and isinstance(value[parent_key], dict):
                            # Check for chassis diffuse
                            if child_key in value[parent_key]:
                                chassis_diffuse_filename = value[parent_key][child_key]
                                if chassis_diffuse_filename in files:
                                    assets_paths.chassis_diffuse_path = f"{chassis_diffuse_filename}"

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