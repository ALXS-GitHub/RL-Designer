import os
import argparse
from utils.create_index.create_json import create_json
from utils.create_index.preview_utils import preview_structure
from constants.create_index.configs import TEXTURE_CONFIGS

def create_index(texture_type="all"):
    """
    Creates index.json files for different texture directories.
    
    Args:
        texture_type: "decals", "balls", "wheels", or "all"
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
    
    total_created = 0
    global_stats = {
        'total_decals': 0,
        'total_variants': 0,
        'variants_without_preview': 0,
        'variants_without_signature': 0
    }
    
    for tex_type in types_to_process:
        config = TEXTURE_CONFIGS[tex_type]
        stats = create_json(config)
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