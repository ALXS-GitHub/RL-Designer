from utils.create_index.hash_utils import calculate_variant_signature
from pathlib import Path
import json
from utils.create_index.assets import get_assets_paths
from utils.create_index.folders import yield_decal_folders

def create_json(config):
    """
    Creates an index file for a single texture type.
    
    Args:
        config: Dictionary with 'dir', 'output', and 'name' keys
    
    Returns:
        dict: Statistics about processed variants, or None if failed
    """
    
    texture_dir = Path(config["dir"])
    output_file = config["output"]
    display_name = config["display_name"]
    
    if not texture_dir.exists():
        print(f"⚠️  {texture_dir} directory not found! Skipping {display_name}...")
        return None

    print(f"\n🔄 Processing {display_name}...")

    index_data = {
        "decals": []
    }
    
    stats = {
        'total_decals': 0,
        'total_variants': 0,
        'variants_without_preview': 0,
        'variants_without_signature': 0
    }
    
    # Iterate through each texture folder
    for texture_folder in yield_decal_folders(texture_dir):
        if not texture_folder.is_dir():
            continue
        
        # Get the relative path from texture_dir to texture_folder's parent
        try:
            relative_to_parent = texture_folder.parent.relative_to(texture_dir)
            relative_path = str(relative_to_parent) if str(relative_to_parent) != "." else None
        except ValueError:
            # texture_folder is not within texture_dir (shouldn't happen but safe fallback)
            relative_path = None
        
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
                assets_paths = get_assets_paths(config, texture_folder, variant_name, files)

                # Calculate variant signature
                try:
                    variant_signature = calculate_variant_signature(variant_folder)
                except (ValueError, FileNotFoundError) as e:
                    print(f"\033[91m⚠️  Failed to calculate signature for {variant_name}: {e}\033[0m")
                    variant_signature = ""

                variant_data = {
                    "variant_name": variant_name,
                    "files": files,
                    "signature": variant_signature,
                }

                # Track missing preview paths
                if not assets_paths.preview_path and not assets_paths.one_diffuse_skin_path:
                    stats['variants_without_preview'] += 1
                    
                # Add preview_path only if it exists
                if assets_paths.preview_path:
                    variant_data["preview_path"] = assets_paths.preview_path
                
                # Add skin_path only if it exists
                if assets_paths.skin_path:
                    variant_data["skin_path"] = assets_paths.skin_path

                if assets_paths.chassis_diffuse_path:
                    variant_data["chassis_diffuse_path"] = assets_paths.chassis_diffuse_path

                # Add one_diffuse_skin_path if it exists
                if assets_paths.one_diffuse_skin_path:
                    variant_data["one_diffuse_skin_path"] = assets_paths.one_diffuse_skin_path

                # Track signature stats
                if not variant_signature:
                    stats['variants_without_signature'] += 1
                
                variants.append(variant_data)
                stats['total_variants'] += 1
        
        # Only add texture if it has variants
        if variants:
            decal_data = {
                "name": texture_folder.name,
                "variants": variants
            }
            if relative_path: decal_data["relative_path"] = relative_path
            index_data["decals"].append(decal_data)
            stats['total_decals'] += 1
    
    # Write the index file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Index created: {output_file}")
    print(f"📊 Found {len(index_data['decals'])} decals with {sum(len(d['variants']) for d in index_data['decals'])} total variants")

    # Print summary for this index
    for texture_item in index_data['decals']:
        variants_with_preview = sum(1 for v in texture_item['variants'] if v.get('preview_path')) + sum(1 for v in texture_item['variants'] if v.get('one_diffuse_skin_path'))
        variants_with_skin = sum(1 for v in texture_item['variants'] if v.get('skin_path'))
        variants_with_chassis_diffuse = sum(1 for v in texture_item['variants'] if v.get('chassis_diffuse_path'))
        variants_with_signature = sum(1 for v in texture_item['variants'] if v.get('signature'))
        total_variants = len(texture_item['variants'])
        print(f"  📁 {texture_item['name']}: {total_variants} variants ({variants_with_preview} with preview, {variants_with_skin} with skin, {variants_with_chassis_diffuse} with chassis diffuse, {variants_with_signature} with signature)")

        for variant in texture_item['variants']:
            preview_status = "✅" if variant.get("preview_path") else "☑️ " if variant.get("one_diffuse_skin_path") else "❌"
            skin_status = "🎨" if variant.get("skin_path") else "⚪"
            chassis_diffuse_status = "🚗" if variant.get("chassis_diffuse_path") else "⚪"
            signature_status = "🔒" if variant.get("signature") else "❌"
            signature_preview = variant.get("signature", "")[:8] + "..." if variant.get("signature") else "none"
            print(f"    📄 {variant['variant_name']}: {preview_status} preview {skin_status} skin {chassis_diffuse_status} chassis diffuse {signature_status} signature ({signature_preview})")
    
    return stats