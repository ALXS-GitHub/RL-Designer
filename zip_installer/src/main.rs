use std::fs::{self, File};
use std::io::{self, Write};
use std::path::Path;
use zip::write::FileOptions;
use zip::ZipWriter;

fn main() -> io::Result<()> {

    println!("Creating zip file...");
    println!("Make sure you have built the release version of the ac_decal_installer project before running this script.");
    println!("Make sure you have updated the version number in the script before running it.");

    // Wait for user confirmation
    println!("Type 'yes' to continue:");
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    if input.trim().to_lowercase() != "yes" {
        println!("Aborting.");
        return Ok(());
    }

    let prepend_path = Path::new("../ac_decal_installer");
    let version = "1.0.0";

    let exe_path = prepend_path.join("target/release/ac_decal_installer.exe");
    let decals_folder = prepend_path.join("decals");
    let zip_file_path = prepend_path.join(format!("release/ac_decal_installer_{}.zip", version));

    let file = File::create(&zip_file_path)?;
    let mut zip = ZipWriter::new(file);

    // Add the executable to the zip file
    add_file_to_zip(&mut zip, &exe_path, "ac_decal_installer.exe")?;

    // Add the decals folder to the zip file
    add_directory_to_zip(&mut zip, &decals_folder, "decals")?;

    zip.finish()?;
    println!("Created zip file: {:?}", zip_file_path);

    Ok(())
}

fn add_file_to_zip<W: Write + io::Seek>(
    zip: &mut ZipWriter<W>,
    file_path: &Path,
    zip_path: &str,
) -> io::Result<()> {
    let mut file = File::open(file_path)?;
    let options: FileOptions<'_, ()> = FileOptions::default().compression_method(zip::CompressionMethod::Stored);
    zip.start_file(zip_path, options)?;
    io::copy(&mut file, zip)?;
    Ok(())
}

fn add_directory_to_zip<W: Write + io::Seek>(
    zip: &mut ZipWriter<W>,
    dir_path: &Path,
    zip_dir_path: &str,
) -> io::Result<()> {
    for entry in fs::read_dir(dir_path)? {
        let entry = entry?;
        let path = entry.path();
        let name = path.file_name().unwrap().to_str().unwrap();
        let zip_path = format!("{}/{}", zip_dir_path, name);

        if path.is_dir() {
            add_directory_to_zip(zip, &path, &zip_path)?;
        } else {
            add_file_to_zip(zip, &path, &zip_path)?;
        }
    }
    Ok(())
}