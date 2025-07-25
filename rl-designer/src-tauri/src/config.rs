use std::env;
use std::path::PathBuf;
use std::collections::HashMap;
use crate::types::elements::ElementType;

pub fn get_appdata() -> Result<String, String> {
    env::var("AppData").map_err(|_| "Failed to get %AppData% environment variable".to_string())
}



pub fn get_install_path(element: ElementType) -> Result<PathBuf, String> {
    let appdata = get_appdata()?;
    let install_path_str = format!(
        r"{}\bakkesmod\bakkesmod\data\acplugin\{}",
        appdata,
        element.get_folder_name()
    );
    let install_path = PathBuf::from(install_path_str);
    Ok(install_path)
}
