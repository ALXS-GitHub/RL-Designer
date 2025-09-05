import os
import argparse
import zipfile
from pathlib import Path
from utils.create_index.folders import yield_decal_folders
from constants.create_index.configs import TEXTURE_CONFIGS

def create_variant_zip(decal_folder, variant_folder, output_dir):
    """
    Creates a zip file for a specific variant.
    
    Args:
        decal_folder: Path to the decal folder
        variant_folder: Path to the variant folder
        output_dir: Directory where to save the zip file
    
    Returns:
        Path to created zip file or None if failed
    """
    decal_name = decal_folder.name
    variant_name = variant_folder.name
    zip_filename = f"{decal_name}_{variant_name}.zip"
    zip_path = output_dir / zip_filename
    
    try:
        # Create output directory if it doesn't exist
        output_dir.mkdir(parents=True, exist_ok=True)
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # Add all files in the variant folder
            for file_path in variant_folder.iterdir():
                if file_path.is_file():
                    # Archive structure: decal_name/variant_name/file.ext
                    archive_path = f"{decal_name}/{variant_name}/{file_path.name}"
                    zipf.write(file_path, archive_path)
        
        return zip_path
    except Exception as e:
        print(f"\033[91m❌ Failed to create {zip_filename}: {e}\033[0m")
        return None

def create_zips_for_type(config):
    """
    Creates zip files for all variants of a specific texture type.
    
    Args:
        config: Configuration dictionary for the texture type
    
    Returns:
        dict: Statistics about processed variants
    """
    texture_dir = Path(config["dir"])
    display_name = config["display_name"]
    
    if not texture_dir.exists():
        print(f"⚠️  {texture_dir} directory not found! Skipping {display_name}...")
        return None

    print(f"\n🔄 Processing {display_name}...")

    # Create zipped directory structure
    zipped_base_dir = Path("zipped") / config["dir"]
    
    stats = {
        'total_decals': 0,
        'total_variants': 0,
        'successful_zips': 0,
        'failed_zips': 0,
        'total_files': 0
    }
    
    # Iterate through each decal folder
    for decal_folder in yield_decal_folders(texture_dir):
        if not decal_folder.is_dir():
            continue
        
        decal_name = decal_folder.name
        decal_output_dir = zipped_base_dir / decal_name
        
        print(f"  📁 Processing decal: {decal_name}")
        
        variant_count = 0
        variant_files_count = 0
        
        # Process each variant folder
        for variant_folder in sorted(decal_folder.iterdir()):
            if not variant_folder.is_dir():
                continue
            
            variant_name = variant_folder.name
            
            # Count files in variant
            files = [f for f in variant_folder.iterdir() if f.is_file()]
            if not files:
                print(f"    ⚠️  Skipping empty variant: {variant_name}")
                continue
            
            # Create zip for this variant
            zip_path = create_variant_zip(decal_folder, variant_folder, decal_output_dir)
            
            if zip_path:
                file_count = len(files)
                zip_size = zip_path.stat().st_size
                zip_size_mb = zip_size / (1024 * 1024)
                
                print(f"    📦 Created: {zip_path.name} ({file_count} files, {zip_size_mb:.2f} MB)")
                stats['successful_zips'] += 1
                variant_files_count += file_count
            else:
                print(f"    ❌ Failed: {variant_name}")
                stats['failed_zips'] += 1
            
            variant_count += 1
            stats['total_variants'] += 1
        
        if variant_count > 0:
            stats['total_decals'] += 1
            stats['total_files'] += variant_files_count
            print(f"    ✅ Completed: {variant_count} variants with {variant_files_count} total files")
    
    # Print summary for this type
    print(f"📊 {display_name} Summary:")
    print(f"  📁 Total decals: {stats['total_decals']}")
    print(f"  📦 Total variants: {stats['total_variants']}")
    print(f"  📄 Total files: {stats['total_files']}")
    print(f"  ✅ Successful zips: {stats['successful_zips']}")
    
    if stats['failed_zips'] > 0:
        print(f"  \033[91m❌ Failed zips: {stats['failed_zips']}\033[0m")
    else:
        print(f"  ❌ Failed zips: {stats['failed_zips']}")
    
    return stats

def zip_decals(texture_type="all"):
    """
    Creates zip files for different texture directories.
    
    Args:
        texture_type: "decals", "balls", "wheels", "boost_meters", or "all"
    """
    
    # Determine which textures to process
    if texture_type == "all":
        types_to_process = list(TEXTURE_CONFIGS.keys())
    elif texture_type in TEXTURE_CONFIGS:
        types_to_process = [texture_type]
    else:
        print(f"❌ Invalid texture type: {texture_type}")
        print(f"Available types: {', '.join(TEXTURE_CONFIGS.keys())}, all")
        return
    
    total_processed = 0
    global_stats = {
        'total_decals': 0,
        'total_variants': 0,
        'successful_zips': 0,
        'failed_zips': 0,
        'total_files': 0
    }
    
    # Ensure zipped directory exists
    Path("zipped").mkdir(exist_ok=True)
    
    for tex_type in types_to_process:
        config = TEXTURE_CONFIGS[tex_type]
        stats = create_zips_for_type(config)
        if stats:
            total_processed += 1
            # Accumulate global stats
            global_stats['total_decals'] += stats['total_decals']
            global_stats['total_variants'] += stats['total_variants']
            global_stats['successful_zips'] += stats['successful_zips']
            global_stats['failed_zips'] += stats['failed_zips']
            global_stats['total_files'] += stats['total_files']
    
    print(f"\n🎉 Successfully processed {total_processed} texture type(s)!")
    
    # Print global summary
    print(f"\n📊 GLOBAL SUMMARY:")
    print(f"  📁 Total decals: {global_stats['total_decals']}")
    print(f"  📦 Total variants: {global_stats['total_variants']}")
    print(f"  📄 Total files: {global_stats['total_files']}")
    print(f"  ✅ Successful zips: {global_stats['successful_zips']}")
    
    # Print warnings in red if there are failures
    if global_stats['failed_zips'] > 0:
        print(f"\033[91m  ❌ Failed zips: {global_stats['failed_zips']}\033[0m")
    else:
        print(f"  ❌ Failed zips: {global_stats['failed_zips']}")
    
    # Calculate total zip size
    total_size = 0
    zipped_path = Path("zipped")
    if zipped_path.exists():
        for zip_file in zipped_path.rglob("*.zip"):
            total_size += zip_file.stat().st_size
        
        total_size_mb = total_size / (1024 * 1024)
        total_size_gb = total_size_mb / 1024
        
        if total_size_gb >= 1:
            print(f"  💾 Total zip size: {total_size_gb:.2f} GB")
        else:
            print(f"  💾 Total zip size: {total_size_mb:.2f} MB")

def main():
    parser = argparse.ArgumentParser(
        description='Create individual zip files for each variant of each decal',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python zip_decals.py                      # Create zips for all texture types
  python zip_decals.py --type decals        # Create zips only for decals
  python zip_decals.py --type balls         # Create zips only for ball textures
  python zip_decals.py --type wheels        # Create zips only for wheel textures
  python zip_decals.py --type boost_meters  # Create zips only for boost meters
        """
    )
    
    parser.add_argument(
        '--type', '-t',
        choices=['decals', 'balls', 'wheels', 'boost_meters', 'all'],
        default='all',
        help='Type of texture to process (default: all)'
    )
    
    args = parser.parse_args()
    
    # Change working directory to ../decals
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'decals'))
    
    print("🗜️  Starting zip creation process...")
    print(f"📂 Working directory: {Path.cwd()}")
    print(f"📦 Output directory: {Path.cwd() / 'zipped'}")
    
    zip_decals(args.type)

if __name__ == "__main__":
    main()