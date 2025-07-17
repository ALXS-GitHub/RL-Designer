use std::fs;
use std::path::Path;
use std::io;
use std::env;
use std::thread;
use std::time;

const DECALS_FOLDER: &str = "./decals"; // Replace with the actual path to your decals folder

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
    let appdata = env::var("AppData").expect("Failed to get %AppData% environment variable");
    let install_path_str = format!(r"{}\bakkesmod\bakkesmod\data\acplugin\DecalTextures", appdata);
    let install_path = Path::new(&install_path_str);
    let decals_folder = Path::new(DECALS_FOLDER); // Replace with the actual path to your decals folder

    // Define the destination install path
    // let install_path_str = shellexpand::env(INSTALL_PATH).unwrap().to_string();
    // let install_path = Path::new(&install_path_str);

    // Check if the decals folder exists
    if !decals_folder.exists() {
        eprintln!("Decals folder does not exist.");
        return;
    }

    // Check if the install path exists
    if !install_path.exists() {
        eprintln!("Install path does not exist. Make sure BakkesMod is installed and ACPlugin is installed and enabled.");
    }

    // Iterate over each subfolder in the decals folder
    for entry in fs::read_dir(decals_folder).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();

        if path.is_dir() {
            let folder_name = path.file_name().unwrap();
            let dest_path = install_path.join(folder_name);

            // If the destination folder exists, remove it
            if dest_path.exists() {
                fs::remove_dir_all(&dest_path).unwrap();
            }

            // Copy the subfolder to the install path
            fs::create_dir_all(&dest_path).unwrap();
            copy_dir_all(&path, &dest_path).unwrap();
        }
    }

    println!("Installation completed. (installed to: {})", install_path_str);
    println!("Exiting in 3 seconds...");
    thread::sleep(time::Duration::from_secs(3));
}
