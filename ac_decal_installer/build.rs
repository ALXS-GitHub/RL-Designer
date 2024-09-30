use std::env;
use std::fs;
use std::path::Path;
use std::io;

fn copy_dir_all(src: &Path, dst: &Path) -> io::Result<()> {
    if !dst.exists() {
        fs::create_dir_all(dst)?;
    }
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());
        if src_path.is_dir() {
            copy_dir_all(&src_path, &dst_path)?;
        } else {
            fs::copy(&src_path, &dst_path)?;
        }
    }
    Ok(())
}

fn main() {
    // Define the source path for the "decals" folder
    let decals_folder = Path::new("decals"); // Replace with the actual path to your decals folder

    // Get the output directory from the environment variable
    let out_dir = env::var("OUT_DIR").unwrap();
    let dest_path = Path::new(&out_dir).join("../../../decals"); // need ../../../ be

    // create the decals folder
    fs::create_dir_all(&dest_path).unwrap();

    // Check if the decals folder exists
    if !decals_folder.exists() {
        eprintln!("Decals folder does not exist.");
        return;
    }

    // Copy the decals folder to the output directory
    if dest_path.exists() {
        fs::remove_dir_all(&dest_path).unwrap();
    }
    fs::create_dir_all(&dest_path).unwrap();

    copy_dir_all(&decals_folder, &dest_path).unwrap();

    println!("cargo:rerun-if-changed=path_to_decals_folder");
}