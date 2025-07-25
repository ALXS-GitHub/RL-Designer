import os
import json
import re
import argparse
import sys
from pathlib import Path
from typing import Dict, Any

def get_script_parent_dir():
    """Get the parent directory of the script's directory"""
    script_dir = Path(__file__).parent
    return script_dir.parent

def read_current_version_from_env(env_path: Path) -> str:
    """Read current version from .env file"""
    if not env_path.exists():
        print(f"⚠️  .env file not found at: {env_path}")
        return "0.0.0"
    
    try:
        with open(env_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for VERSION=x.x.x
        version_match = re.search(r'VERSION\s*=\s*["\']?([^"\'\s]+)["\']?', content)
        if version_match:
            return version_match.group(1)
        else:
            print("⚠️  VERSION not found in .env file")
            return "0.0.0"
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return "0.0.0"

def validate_version(version: str) -> bool:
    """Validate version format (semantic versioning)"""
    pattern = r'^\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?$'
    return bool(re.match(pattern, version))

def update_package_json(file_path: Path, new_version: str) -> bool:
    """Update version in package.json"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        old_version = data.get('version', 'unknown')
        data['version'] = new_version
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Updated {file_path.name}: {old_version} → {new_version}")
        return True
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def update_package_lock_json(file_path: Path, new_version: str) -> bool:
    """Update version in package-lock.json (2 places: root and packages."")"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        old_version = data.get('version', 'unknown')
        
        # Update root version
        data['version'] = new_version
        
        # Update packages."" version (lockfile v2/v3 format)
        if 'packages' in data and '' in data['packages']:
            data['packages']['']['version'] = new_version
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Updated {file_path.name}: {old_version} → {new_version}")
        return True
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def update_env_file(file_path: Path, new_version: str) -> bool:
    """Update VERSION in .env file"""
    try:
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        else:
            content = ""
        
        # Find and replace VERSION
        version_pattern = r'(VERSION\s*=\s*)["\']?[^"\'\s]+["\']?'
        new_line = f'VERSION={new_version}'
        
        if re.search(version_pattern, content):
            # Replace existing version
            new_content = re.sub(version_pattern, new_line, content)
            old_version_match = re.search(r'VERSION\s*=\s*["\']?([^"\'\s]+)["\']?', content)
            old_version = old_version_match.group(1) if old_version_match else 'unknown'
        else:
            # Add new version line
            new_content = content + f'\n{new_line}\n' if content else f'{new_line}\n'
            old_version = 'not set'
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Updated {file_path.name}: {old_version} → {new_version}")
        return True
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def update_tauri_config(file_path: Path, new_version: str) -> bool:
    """Update version in tauri.conf.json"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        old_version = data.get('version', 'unknown')
        data['version'] = new_version
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Updated {file_path.name}: {old_version} → {new_version}")
        return True
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def update_cargo_toml(file_path: Path, new_version: str) -> bool:
    """Update version in Cargo.toml"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find current version
        version_match = re.search(r'version\s*=\s*["\']([^"\']+)["\']', content)
        old_version = version_match.group(1) if version_match else 'unknown'
        
        # Replace version
        new_content = re.sub(
            r'(version\s*=\s*["\'])[^"\']+(["\'])',
            f'\\g<1>{new_version}\\g<2>',
            content
        )
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Updated {file_path.name}: {old_version} → {new_version}")
        return True
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def update_version_everywhere(new_version: str) -> bool:
    """Update version in all required files"""
    # Set working directory to parent of script directory
    root_dir = get_script_parent_dir()
    os.chdir(root_dir)
    print(f"🏠 Working directory: {root_dir}")
    
    # Define file paths
    files_to_update = {
        'package.json': ('rl-designer/package.json', update_package_json),
        'package-lock.json': ('rl-designer/package-lock.json', update_package_lock_json),
        '.env': ('rl-designer/.env', update_env_file),
        'tauri.conf.json': ('rl-designer/src-tauri/tauri.conf.json', update_tauri_config),
        'Cargo.toml': ('rl-designer/src-tauri/Cargo.toml', update_cargo_toml),
    }
    
    success_count = 0
    total_count = len(files_to_update)
    
    print(f"\n🔄 Updating version to {new_version} in {total_count} files...\n")
    
    for file_type, (file_path_str, update_func) in files_to_update.items():
        file_path = Path(file_path_str)
        
        if not file_path.exists():
            print(f"⚠️  {file_type} not found: {file_path}")
            continue
        
        if update_func(file_path, new_version):
            success_count += 1
    
    print(f"\n🎉 Successfully updated {success_count}/{total_count} files!")
    return success_count == total_count

def main():
    parser = argparse.ArgumentParser(
        description='Update version everywhere in the RL Designer codebase',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python update_version.py 1.2.3           # Update to version 1.2.3
  python update_version.py 2.0.0-beta.1    # Update to pre-release version
  python update_version.py --show-current  # Show current version
  python update_version.py --check         # Validate current versions consistency
        """
    )
    
    parser.add_argument(
        'version',
        nargs='?',
        help='New version to set (e.g., 1.2.3 or 2.0.0-beta.1)'
    )
    
    parser.add_argument(
        '--show-current', '-s',
        action='store_true',
        help='Show current version from .env file'
    )
    
    parser.add_argument(
        '--check', '-c',
        action='store_true',
        help='Check version consistency across all files'
    )
    
    args = parser.parse_args()
    
    # Set working directory
    root_dir = get_script_parent_dir()
    os.chdir(root_dir)
    
    # Show current version
    if args.show_current:
        env_path = Path('rl-designer/.env')
        current_version = read_current_version_from_env(env_path)
        print(f"📋 Current version (from .env): {current_version}")
        return
    
    # Check version consistency
    if args.check:
        check_version_consistency()
        return
    
    # Update version
    if not args.version:
        parser.print_help()
        sys.exit(1)
    
    new_version = args.version
    
    # Validate version format
    if not validate_version(new_version):
        print(f"❌ Invalid version format: {new_version}")
        print("Expected format: X.Y.Z or X.Y.Z-prerelease")
        sys.exit(1)
    
    # Show current version
    env_path = Path('rl-designer/.env')
    current_version = read_current_version_from_env(env_path)
    print(f"📋 Current version: {current_version}")
    print(f"🎯 New version: {new_version}")
    
    # Confirm update
    if current_version != "0.0.0":
        confirm = input(f"\n❓ Update version from {current_version} to {new_version}? (y/N): ")
        if confirm.lower() not in ['y', 'yes']:
            print("❌ Update cancelled")
            sys.exit(0)
    
    # Perform update
    success = update_version_everywhere(new_version)
    
    if success:
        print(f"\n🚀 Version successfully updated to {new_version}!")
        print("\n📝 Don't forget to:")
        print("   • Review the changes")
        print("   • Commit the version bump")
        print("   • Create a git tag if needed")
    else:
        print(f"\n⚠️  Some files failed to update. Please review the errors above.")
        sys.exit(1)

def check_version_consistency():
    """Check if versions are consistent across all files"""
    print("🔍 Checking version consistency...\n")
    
    files_to_check = {
        '.env': ('rl-designer/.env', read_version_from_env),
        'package.json': ('rl-designer/package.json', read_version_from_json),
        'package-lock.json': ('rl-designer/package-lock.json', read_version_from_json),
        'tauri.conf.json': ('rl-designer/src-tauri/tauri.conf.json', read_version_from_json),
        'Cargo.toml': ('rl-designer/src-tauri/Cargo.toml', read_version_from_cargo),
    }
    
    versions = {}
    
    for file_type, (file_path_str, read_func) in files_to_check.items():
        file_path = Path(file_path_str)
        if file_path.exists():
            version = read_func(file_path)
            versions[file_type] = version
            print(f"📄 {file_type:20}: {version}")
        else:
            print(f"⚠️  {file_type:20}: File not found")
    
    # Check consistency
    unique_versions = set(versions.values())
    if len(unique_versions) == 1:
        print(f"\n✅ All versions are consistent: {list(unique_versions)[0]}")
    else:
        print(f"\n❌ Version mismatch detected!")
        print(f"Found versions: {', '.join(unique_versions)}")

def read_version_from_env(file_path: Path) -> str:
    """Read version from .env file"""
    return read_current_version_from_env(file_path)

def read_version_from_json(file_path: Path) -> str:
    """Read version from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('version', 'unknown')
    except:
        return 'error'

def read_version_from_cargo(file_path: Path) -> str:
    """Read version from Cargo.toml"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        version_match = re.search(r'version\s*=\s*["\']([^"\']+)["\']', content)
        return version_match.group(1) if version_match else 'not found'
    except:
        return 'error'

if __name__ == "__main__":
    main()