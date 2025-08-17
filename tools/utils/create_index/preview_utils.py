from pathlib import Path
from constants.create_index.configs import TEXTURE_CONFIGS
from utils.create_index.folders import yield_decal_folders

def preview_structure(texture_type="all"):
    """Preview the directory structure without creating the index"""
    
    texture_configs = {key: value["dir"] for key, value in TEXTURE_CONFIGS.items()}
    
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
        
        for texture_folder in yield_decal_folders(texture_dir):
            if not texture_folder.is_dir():
                continue
                
            print(f"  📁 {texture_folder.name}/")
            
            for variant_folder in sorted(texture_folder.iterdir()):
                if not variant_folder.is_dir():
                    continue
                    
                file_count = len([f for f in variant_folder.iterdir() if f.is_file()])
                json_count = len([f for f in variant_folder.iterdir() if f.is_file() and f.name.endswith('.json')])
                print(f"    📁 {variant_folder.name}/ ({file_count} files, {json_count} JSON)")