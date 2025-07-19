import os
import json
from pathlib import Path

def create_index():
    """
    Creates an index.json file for the decals directory structure.
    
    Expected structure:
    decals/
    ├── DecalName1/
    │   ├── Variant1/
    │   │   ├── file1.png
    │   │   ├── file2.json
    │   │   └── ...
    │   └── Variant2/
    │       └── ...
    └── DecalName2/
        └── ...
    """
    
    decals_dir = Path("decals")
    
    if not decals_dir.exists():
        print(f"Error: {decals_dir} directory not found!")
        return
    
    index_data = {
        "decals": []
    }
    
    # Iterate through each decal folder
    for decal_folder in sorted(decals_dir.iterdir()):
        if not decal_folder.is_dir():
            continue
            
        decal_name = decal_folder.name
        variants = []
        
        # Iterate through each variant folder within the decal
        for variant_folder in sorted(decal_folder.iterdir()):
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
        
        # Only add decal if it has variants
        if variants:
            # Get preview path from first variant (relative path)
            preview_path = get_preview_path(decal_name, variants[0]) if variants else None
            
            index_data["decals"].append({
                "name": decal_name,
                "variants": variants,
                "preview_path": preview_path
            })
    
    # Write the index.json file
    output_file = "index.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Index created successfully: {output_file}")
    print(f"📊 Found {len(index_data['decals'])} decals with {sum(len(d['variants']) for d in index_data['decals'])} total variants")
    
    # Print summary
    for decal in index_data["decals"]:
        preview_status = "✅" if decal.get("preview_path") else "❌"
        print(f"  📁 {decal['name']}: {len(decal['variants'])} variants {preview_status}")

def get_preview_path(decal_name, first_variant):
    """
    Extract preview path from the first variant by reading JSON files
    and looking for Body.Diffuse field
    """
    variant_name = first_variant["variant"]
    files = first_variant["files"]
    
    # Find the first JSON file
    json_files = [f for f in files if f.endswith('.json')]
    if not json_files:
        print(f"    ⚠️  No JSON file found in {decal_name}/{variant_name}")
        return None
    
    json_file = json_files[0]
    json_path = Path("decals") / decal_name / variant_name / json_file
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        # Look for Body.Diffuse in any top-level key
        for key, value in json_data.items():
            if isinstance(value, dict) and "Body" in value:
                body = value["Body"]
                if isinstance(body, dict) and "Diffuse" in body:
                    diffuse_filename = body["Diffuse"]
                    
                    # Check if this file exists in the variant files list
                    if diffuse_filename in files:
                        # Return the relative path
                        preview_path = f"decals/{decal_name}/{variant_name}/{diffuse_filename}"
                        print(f"    ✅ Preview found: {diffuse_filename}")
                        return preview_path
        
        print(f"    ⚠️  No Body.Diffuse found in {json_file}")
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

def preview_structure():
    """Preview the directory structure without creating the index"""
    decals_dir = Path("decals")
    
    if not decals_dir.exists():
        print(f"Error: {decals_dir} directory not found!")
        return
    
    print("📂 Directory structure preview:")
    
    for decal_folder in sorted(decals_dir.iterdir()):
        if not decal_folder.is_dir():
            continue
            
        print(f"  📁 {decal_folder.name}/")
        
        for variant_folder in sorted(decal_folder.iterdir()):
            if not variant_folder.is_dir():
                continue
                
            file_count = len([f for f in variant_folder.iterdir() if f.is_file()])
            json_count = len([f for f in variant_folder.iterdir() if f.is_file() and f.name.endswith('.json')])
            print(f"    📁 {variant_folder.name}/ ({file_count} files, {json_count} JSON)")

def show_help():
    print("Usage:")
    print("  python create_index.py          - Create the index.json file")
    print("  python create_index.py --preview   - Preview the directory structure without creating the file")
    print("  python create_index.py --help      - Show this help message")

if __name__ == "__main__":
    import sys
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    if len(sys.argv) > 1 and sys.argv[1] == "--preview":
        preview_structure()
    elif len(sys.argv) > 1 and sys.argv[1] == "--help":
        show_help()
    else:
        create_index()