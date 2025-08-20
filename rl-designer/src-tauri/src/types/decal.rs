use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct DecalsIndex {
    pub decals: Vec<DecalInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DecalInfo {
    pub name: String,
    pub variants: Vec<VariantInfo>,
    pub relative_path: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct VariantInfo {
    pub variant_name: String,
    pub signature: String,
    pub files: Vec<String>,
    pub preview_path: Option<String>, // diffuse
    pub skin_path: Option<String>,
    pub chassis_diffuse_path: Option<String>,
    pub one_diffuse_skin_path: Option<String>, // 1_Diffuse_Skin
    pub imageseq_subuv_path: Option<String>, // for looper wheel textures
}

impl Default for DecalInfo {
    fn default() -> Self {
        DecalInfo {
            name: String::new(),
            variants: Vec::new(),
            relative_path: None,
        }
    }
}

impl PartialEq for DecalInfo {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name
    }
}

impl Eq for DecalInfo {}

impl Ord for DecalInfo {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.name.cmp(&other.name)
    }
}

impl PartialOrd for DecalInfo {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}
