import os
import json
import argparse
from pathlib import Path
from utils.hash_utils import calculate_variant_signature

def create_index(texture_type="all"):
    """
    Creates index.json files for different texture directories.
    
    Args:
        texture_type: "decals", "balls", "wheels", or "all"
    """
    
    texture_configs = {
        "decals": {
            "dir": "decals",
            "output": "index.json",
            "name": "decals"
        },
        "balls": {
            "dir": "ball_textures",
            "output": "ball_index.json",
            "name": "decals"
        },
        "wheels": {
            "dir": "wheel_textures", 
            "output": "wheel_index.json",
            "name": "decals"
        }
    }
    
    # Determine which textures to process
    if texture_type == "all":
        types_to_process = list(texture_configs.keys())
    elif texture_type in texture_configs:
        types_to_process = [texture_type]
    else:
        print(f"❌ Invalid texture type: {texture_type}")
        print(f"Available types: {', '.join(texture_configs.keys())}, all")
        return
    
    total_created = 0
    global_stats = {
        'total_decals': 0,
        'total_variants': 0,
        'variants_without_preview': 0,
        'variants_without_signature': 0
    }
    
    for tex_type in types_to_process:
        config = texture_configs[tex_type]
        stats = create_single_index(config)
        if stats:
            total_created += 1
            # Accumulate global stats
            global_stats['total_decals'] += stats['total_decals']
            global_stats['total_variants'] += stats['total_variants']
            global_stats['variants_without_preview'] += stats['variants_without_preview']
            global_stats['variants_without_signature'] += stats['variants_without_signature']
    
    print(f"\n🎉 Successfully created {total_created} index file(s)!")
    
    # Print global summary
    print(f"\n📊 GLOBAL SUMMARY:")
    print(f"  📁 Total decals: {global_stats['total_decals']}")
    print(f"  📄 Total variants: {global_stats['total_variants']}")
    
    # Print warnings in red if there are issues
    if global_stats['variants_without_preview'] > 0:
        print(f"\033[91m  ❌ Variants without preview: {global_stats['variants_without_preview']}\033[0m")
    else:
        print(f"  ✅ Variants without preview: {global_stats['variants_without_preview']}")
    
    if global_stats['variants_without_signature'] > 0:
        print(f"\033[91m  ❌ Variants without signature: {global_stats['variants_without_signature']}\033[0m")
    else:
        print(f"  ✅ Variants without signature: {global_stats['variants_without_signature']}")

def create_single_index(config):
    """
    Creates an index file for a single texture type.
    
    Args:
        config: Dictionary with 'dir', 'output', and 'name' keys
    
    Returns:
        dict: Statistics about processed variants, or None if failed
    """
    
    texture_dir = Path(config["dir"])
    output_file = config["output"]
    texture_name = config["name"]
    
    if not texture_dir.exists():
        print(f"⚠️  {texture_dir} directory not found! Skipping {texture_name}...")
        return None
    
    print(f"\n🔄 Processing {texture_name}...")
    
    index_data = {
        texture_name: []
    }
    
    stats = {
        'total_decals': 0,
        'total_variants': 0,
        'variants_without_preview': 0,
        'variants_without_signature': 0
    }
    
    # Iterate through each texture folder
    for texture_folder in sorted(texture_dir.iterdir()):
        if not texture_folder.is_dir():
            continue
            
        texture_item_name = texture_folder.name
        variants = []
        
        # Iterate through each variant folder within the texture
        for variant_folder in sorted(texture_folder.iterdir()):
            if not variant_folder.is_dir():
                continue
                
            variant_name = variant_folder.name
            files = []
            
            # Get all files in the variant folder
            for file_path in sorted(variant_folder.iterdir()):
                if file_path.is_file():
                    files.append(file_path.name)
            
            # Only add variant if it has files
            if files:
                # Get preview path and skin path for this specific variant
                preview_path, skin_path, chassis_diffuse_path, one_diffuse_skin_path = get_preview_path(texture_item_name, variant_name, files, config["dir"])
                
                # Calculate variant signature
                try:
                    variant_signature = calculate_variant_signature(variant_folder)
                except (ValueError, FileNotFoundError) as e:
                    print(f"\033[91m⚠️  Failed to calculate signature for {variant_name}: {e}\033[0m")
                    variant_signature = ""

                variant_data = {
                    "variant_name": variant_name,
                    "files": files,
                    "signature": variant_signature
                }

                # Track missing preview paths
                if not preview_path and not one_diffuse_skin_path:
                    stats['variants_without_preview'] += 1
                    
                # Add preview_path only if it exists
                if preview_path:
                    variant_data["preview_path"] = preview_path
                
                # Add skin_path only if it exists
                if skin_path:
                    variant_data["skin_path"] = skin_path
                    
                if chassis_diffuse_path:
                    variant_data["chassis_diffuse_path"] = chassis_diffuse_path
                    
                # Add one_diffuse_skin_path if it exists
                if one_diffuse_skin_path:
                    variant_data["one_diffuse_skin_path"] = one_diffuse_skin_path

                # Track signature stats
                if not variant_signature:
                    stats['variants_without_signature'] += 1
                
                variants.append(variant_data)
                stats['total_variants'] += 1
        
        # Only add texture if it has variants
        if variants:
            index_data[texture_name].append({
                "name": texture_item_name,
                "variants": variants
            })
            stats['total_decals'] += 1
    
    # Write the index file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Index created: {output_file}")
    print(f"📊 Found {len(index_data[texture_name])} {texture_name} with {sum(len(d['variants']) for d in index_data[texture_name])} total variants")
    
    # Print summary for this index    
    for texture_item in index_data[texture_name]:
        variants_with_preview = sum(1 for v in texture_item['variants'] if v.get('preview_path')) + sum(1 for v in texture_item['variants'] if v.get('one_diffuse_skin_path'))
        variants_with_skin = sum(1 for v in texture_item['variants'] if v.get('skin_path'))
        variants_with_chassis_diffuse = sum(1 for v in texture_item['variants'] if v.get('chassis_diffuse_path'))
        variants_with_signature = sum(1 for v in texture_item['variants'] if v.get('signature'))
        total_variants = len(texture_item['variants'])
        print(f"  📁 {texture_item['name']}: {total_variants} variants ({variants_with_preview} with preview, {variants_with_skin} with skin, {variants_with_chassis_diffuse} with chassis diffuse, {variants_with_signature} with signature)")

        for variant in texture_item['variants']:
            preview_status = "✅" if variant.get("preview_path") else "☑️" if variant.get("one_diffuse_skin_path") else "❌"
            skin_status = "🎨" if variant.get("skin_path") else "⚪"
            chassis_diffuse_status = "🚗" if variant.get("chassis_diffuse_path") else "⚪"
            signature_status = "🔒" if variant.get("signature") else "❌"
            signature_preview = variant.get("signature", "")[:8] + "..." if variant.get("signature") else "none"
            print(f"    📄 {variant['variant_name']}: {preview_status} preview {skin_status} skin {chassis_diffuse_status} chassis diffuse {signature_status} signature ({signature_preview})")
    
    return stats

def get_preview_path(texture_name, variant_name, files, base_dir):
    """
    Extract preview path and skin path from a variant by reading JSON files
    and looking for Body.Diffuse field (or Ball.Diffuse, Wheel.Diffuse for other types)
    and corresponding Skin fields
    
    Args:
        texture_name: Name of the texture folder
        variant_name: Name of the variant folder
        files: List of files in the variant folder
        base_dir: Base directory path
    
    Returns:
        tuple: (preview_path, skin_path, chassis_diffuse_path) - any can be None if not found
    """
    
    # Find the first JSON file
    json_files = [f for f in files if f.endswith('.json')]
    if not json_files:
        return None, None, None
    
    json_file = json_files[0]
    json_path = Path(base_dir) / texture_name / variant_name / json_file
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        # Look for different diffuse and skin patterns based on texture type
        diffuse_patterns = ["Body.Diffuse", "Params.Diffuse", "Wheel.Diffuse"]
        skin_patterns = ["Body.Skin", "Params.Skin", "Wheel.Skin"]
        chassis_diffuse_patterns = ["Chassis.Diffuse"]
        one_diffuse_skin_patterns = ["Body.1_Diffuse_Skin", "Params.1_Diffuse_Skin", "Wheel.1_Diffuse_Skin"]

        preview_path = None
        skin_path = None
        chassis_diffuse_path = None
        one_diffuse_skin_path = None
        
        # Look for any diffuse and skin field in any top-level key
        for key, value in json_data.items():
            if isinstance(value, dict):
                for i, diffuse_pattern in enumerate(diffuse_patterns):
                    skin_pattern = skin_patterns[i]  # Corresponding skin pattern
                    
                    if "." in diffuse_pattern:
                        # Nested pattern like "Body.Diffuse" and "Body.Skin"
                        parent_key, child_key = diffuse_pattern.split(".", 1)
                        skin_parent_key, skin_child_key = skin_pattern.split(".", 1)
                        one_diffuse_skin_parent_key, one_diffuse_skin_child_key = one_diffuse_skin_patterns[i].split(".", 1)

                        if parent_key in value and isinstance(value[parent_key], dict):
                            # Check for diffuse
                            if child_key in value[parent_key]:
                                diffuse_filename = value[parent_key][child_key]
                                if diffuse_filename in files:
                                    preview_path = f"{diffuse_filename}"
                            
                            # Check for skin in the same parent
                            if skin_child_key in value[parent_key]:
                                skin_filename = value[parent_key][skin_child_key]
                                if skin_filename in files:
                                    skin_path = f"{skin_filename}"

                            # Check for 1_Diffuse_Skin in the same parent
                            if one_diffuse_skin_child_key in value[parent_key]:
                                one_diffuse_skin_filename = value[parent_key][one_diffuse_skin_child_key]
                                if one_diffuse_skin_filename in files:
                                    one_diffuse_skin_path = f"{one_diffuse_skin_filename}"

                    # If we found a preview path, we can break (we found the right pattern)
                    if preview_path:
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
                                    chassis_diffuse_path = f"{chassis_diffuse_filename}"

        return preview_path, skin_path, chassis_diffuse_path, one_diffuse_skin_path

    except json.JSONDecodeError as e:
        print(f"    ❌ Error parsing JSON {json_file} for {variant_name}: {e}")
        return None, None, None
    except FileNotFoundError:
        print(f"    ❌ JSON file not found: {json_path}")
        return None, None, None
    except Exception as e:
        print(f"    ❌ Error reading {json_file} for {variant_name}: {e}")
        return None, None, None

def preview_structure(texture_type="all"):
    """Preview the directory structure without creating the index"""
    
    texture_configs = {
        "decals": "decals",
        "balls": "ball_textures",
        "wheels": "wheel_textures"
    }
    
    # Determine which directories to preview
    if texture_type == "all":
        dirs_to_preview = texture_configs
    elif texture_type in texture_configs:
        dirs_to_preview = {texture_type: texture_configs[texture_type]}
    else:
        print(f"❌ Invalid texture type: {texture_type}")
        return
    
    for tex_type, dir_name in dirs_to_preview.items():
        texture_dir = Path(dir_name)
        
        if not texture_dir.exists():
            print(f"⚠️  {dir_name} directory not found! Skipping {tex_type}...")
            continue
        
        print(f"\n📂 {tex_type.upper()} structure preview ({dir_name}):")
        
        for texture_folder in sorted(texture_dir.iterdir()):
            if not texture_folder.is_dir():
                continue
                
            print(f"  📁 {texture_folder.name}/")
            
            for variant_folder in sorted(texture_folder.iterdir()):
                if not variant_folder.is_dir():
                    continue
                    
                file_count = len([f for f in variant_folder.iterdir() if f.is_file()])
                json_count = len([f for f in variant_folder.iterdir() if f.is_file() and f.name.endswith('.json')])
                print(f"    📁 {variant_folder.name}/ ({file_count} files, {json_count} JSON)")

def main():
    parser = argparse.ArgumentParser(
        description='Create index files for texture directories',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python create_index.py                    # Create all index files
  python create_index.py --type decals      # Create only decals index
  python create_index.py --type balls       # Create only ball textures index
  python create_index.py --type wheels      # Create only wheel textures index
  python create_index.py --preview          # Preview all directory structures
  python create_index.py --preview --type decals  # Preview only decals structure
        """
    )
    
    parser.add_argument(
        '--type', '-t',
        choices=['decals', 'balls', 'wheels', 'all'],
        default='all',
        help='Type of texture to process (default: all)'
    )
    
    parser.add_argument(
        '--preview', '-p',
        action='store_true',
        help='Preview directory structure without creating index files'
    )
    
    args = parser.parse_args()
    
    # Change script to ../decals
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'decals'))
    
    if args.preview:
        preview_structure(args.type)
    else:
        create_index(args.type)

if __name__ == "__main__":
    main()