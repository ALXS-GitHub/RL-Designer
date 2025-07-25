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
                variants.append({
                    "variant": variant_name,
                    "files": files
                })
        
        # Only add texture if it has variants
        if variants:
            # Get preview path from first variant
            preview_path = get_preview_path(texture_item_name, variants[0], config["dir"]) if variants else None
            
            index_data[texture_name].append({
                "name": texture_item_name,
                "variants": variants,
                "preview_path": preview_path
            })
    
    # Write the index file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Index created: {output_file}")
    print(f"📊 Found {len(index_data[texture_name])} {texture_name} with {sum(len(d['variants']) for d in index_data[texture_name])} total variants")
    
    # Print summary
    for texture_item in index_data[texture_name]:
        preview_status = "✅" if texture_item.get("preview_path") else "❌"
        print(f"  📁 {texture_item['name']}: {len(texture_item['variants'])} variants {preview_status}")
    
    return True

def get_preview_path(texture_name, first_variant, base_dir):
    """
    Extract preview path from the first variant by reading JSON files
    and looking for Body.Diffuse field (or Ball.Diffuse, Wheel.Diffuse for other types)
    """
    variant_name = first_variant["variant"]
    files = first_variant["files"]
    
    # Find the first JSON file
    json_files = [f for f in files if f.endswith('.json')]
    if not json_files:
        print(f"    ⚠️  No JSON file found in {texture_name}/{variant_name}")
        return None
    
    json_file = json_files[0]
    json_path = Path(base_dir) / texture_name / variant_name / json_file
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        # Look for different diffuse patterns based on texture type
        diffuse_patterns = ["Body.Diffuse", "Params.Diffuse", "Wheel.Diffuse", "Diffuse"]
        
        # Look for any diffuse field in any top-level key
        for key, value in json_data.items():
            if isinstance(value, dict):
                for pattern in diffuse_patterns:
                    if "." in pattern:
                        # Nested pattern like "Body.Diffuse"
                        parent_key, child_key = pattern.split(".", 1)
                        if parent_key in value and isinstance(value[parent_key], dict):
                            if child_key in value[parent_key]:
                                diffuse_filename = value[parent_key][child_key]
                                if diffuse_filename in files:
                                    preview_path = f"{base_dir}/{texture_name}/{variant_name}/{diffuse_filename}"
                                    print(f"    ✅ Preview found: {diffuse_filename}")
                                    return preview_path
                    else:
                        # Direct pattern like "Diffuse"
                        if pattern in value:
                            diffuse_filename = value[pattern]
                            if diffuse_filename in files:
                                preview_path = f"{base_dir}/{texture_name}/{variant_name}/{diffuse_filename}"
                                print(f"    ✅ Preview found: {diffuse_filename}")
                                return preview_path
        
        print(f"    ⚠️  No diffuse field found in {json_file}")
        return None
        
    except json.JSONDecodeError as e:
        print(f"    ❌ Error parsing JSON {json_file}: {e}")
        return None
    except FileNotFoundError:
        print(f"    ❌ JSON file not found: {json_path}")
        return None
    except Exception as e:
        print(f"    ❌ Error reading {json_file}: {e}")
        return None

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