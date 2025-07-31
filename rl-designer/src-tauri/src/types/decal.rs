#[derive(Debug, serde::Serialize, Clone)]
pub struct VariantFrontInfo {
    pub variant_name: String,
    pub preview_path: Option<String>,
    pub skin_path: Option<String>,
    pub chassis_diffuse_path: Option<String>,
}

#[derive(Debug, serde::Serialize)]
pub struct DecalTextures {
    pub name: String,
    pub variants: Vec<VariantFrontInfo>,
}

impl Default for DecalTextures {
    fn default() -> Self {
        DecalTextures {
            name: String::new(),
            variants: Vec::new(),
        }
    }
}

impl PartialEq for DecalTextures {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name
    }
}

impl Eq for DecalTextures {}

impl Ord for DecalTextures {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.name.cmp(&other.name)
    }
}

impl PartialOrd for DecalTextures {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}
