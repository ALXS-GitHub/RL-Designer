import os
import json
import argparse
from pathlib import Path

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
    
    for tex_type in types_to_process:
        config = texture_configs[tex_type]
        if create_single_index(config):
            total_created += 1
    
    print(f"\n🎉 Successfully created {total_created} index file(s)!")

def create_single_index(config):
    """
    Creates an index file for a single texture type.
    
    Args:
        config: Dictionary with 'dir', 'output', and 'name' keys
    
    Returns:
        bool: True if successful, False otherwise
    """
    
    texture_dir = Path(config["dir"])
    output_file = config["output"]
    texture_name = config["name"]
    
    if not texture_dir.exists():
        print(f"⚠️  {texture_dir} directory not found! Skipping {texture_name}...")
        return False
    
    print(f"\n🔄 Processing {texture_name}...")
    
    index_data = {
        texture_name: []
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
                preview_path, skin_path = get_preview_path(texture_item_name, variant_name, files, config["dir"])
                
                variant_data = {
                    "variant": variant_name,
                    "files": files
                }
                
                # Add preview_path only if it exists
                if preview_path:
                    variant_data["preview_path"] = preview_path
                
                # Add skin_path only if it exists
                if skin_path:
                    variant_data["skin_path"] = skin_path
                
                variants.append(variant_data)
        
        # Only add texture if it has variants
        if variants:
            index_data[texture_name].append({
                "name": texture_item_name,
                "variants": variants
            })
    
    # Write the index file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Index created: {output_file}")
    print(f"📊 Found {len(index_data[texture_name])} {texture_name} with {sum(len(d['variants']) for d in index_data[texture_name])} total variants")
    
    # Print summary
    for texture_item in index_data[texture_name]:
        variants_with_preview = sum(1 for v in texture_item['variants'] if v.get('preview_path'))
        variants_with_skin = sum(1 for v in texture_item['variants'] if v.get('skin_path'))
        total_variants = len(texture_item['variants'])
        print(f"  📁 {texture_item['name']}: {total_variants} variants ({variants_with_preview} with preview, {variants_with_skin} with skin)")
        
        # Show preview and skin status for each variant
        for variant in texture_item['variants']:
            preview_status = "✅" if variant.get("preview_path") else "❌"
            skin_status = "🎨" if variant.get("skin_path") else "⚪"
            print(f"    📄 {variant['variant']}: {preview_status} preview {skin_status} skin")
    
    return True

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
        tuple: (preview_path, skin_path) - skin_path can be None if not found
    """
    
    # Find the first JSON file
    json_files = [f for f in files if f.endswith('.json')]
    if not json_files:
        print(f"    ⚠️  No JSON file found in {texture_name}/{variant_name}")
        return None, None
    
    json_file = json_files[0]
    json_path = Path(base_dir) / texture_name / variant_name / json_file
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        # Look for different diffuse and skin patterns based on texture type
        diffuse_patterns = ["Body.Diffuse", "Params.Diffuse", "Wheel.Diffuse", "Diffuse"]
        skin_patterns = ["Body.Skin", "Params.Skin", "Wheel.Skin", "Skin"]
        
        preview_path = None
        skin_path = None
        
        # Look for any diffuse and skin field in any top-level key
        for key, value in json_data.items():
            if isinstance(value, dict):
                for i, diffuse_pattern in enumerate(diffuse_patterns):
                    skin_pattern = skin_patterns[i]  # Corresponding skin pattern
                    
                    if "." in diffuse_pattern:
                        # Nested pattern like "Body.Diffuse" and "Body.Skin"
                        parent_key, child_key = diffuse_pattern.split(".", 1)
                        skin_parent_key, skin_child_key = skin_pattern.split(".", 1)
                        
                        if parent_key in value and isinstance(value[parent_key], dict):
                            # Check for diffuse
                            if child_key in value[parent_key]:
                                diffuse_filename = value[parent_key][child_key]
                                if diffuse_filename in files:
                                    preview_path = f"{base_dir}/{texture_name}/{variant_name}/{diffuse_filename}"
                                    print(f"    ✅ Preview found for {variant_name}: {diffuse_filename}")
                            
                            # Check for skin in the same parent
                            if skin_child_key in value[parent_key]:
                                skin_filename = value[parent_key][skin_child_key]
                                if skin_filename in files:
                                    skin_path = f"{base_dir}/{texture_name}/{variant_name}/{skin_filename}"
                                    print(f"    ✅ Skin found for {variant_name}: {skin_filename}")
                    else:
                        # Direct pattern like "Diffuse" and "Skin"
                        if diffuse_pattern in value:
                            diffuse_filename = value[diffuse_pattern]
                            if diffuse_filename in files:
                                preview_path = f"{base_dir}/{texture_name}/{variant_name}/{diffuse_filename}"
                                print(f"    ✅ Preview found for {variant_name}: {diffuse_filename}")
                        
                        if skin_pattern in value:
                            skin_filename = value[skin_pattern]
                            if skin_filename in files:
                                skin_path = f"{base_dir}/{texture_name}/{variant_name}/{skin_filename}"
                                print(f"    ✅ Skin found for {variant_name}: {skin_filename}")
                    
                    # If we found a preview path, we can break (we found the right pattern)
                    if preview_path:
                        break
                
                # If we found a preview path, break out of outer loop too
                if preview_path:
                    break
        
        if not preview_path:
            print(f"    ⚠️  No diffuse field found in {json_file} for {variant_name}")
        
        return preview_path, skin_path
        
    except json.JSONDecodeError as e:
        print(f"    ❌ Error parsing JSON {json_file} for {variant_name}: {e}")
        return None, None
    except FileNotFoundError:
        print(f"    ❌ JSON file not found: {json_path}")
        return None, None
    except Exception as e:
        print(f"    ❌ Error reading {json_file} for {variant_name}: {e}")
        return None, None

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