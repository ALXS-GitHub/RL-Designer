#[derive(Debug, serde::Serialize)]
pub struct DecalTextures {
    pub name: String,
    pub variants: Vec<String>,
    pub preview_path: Option<String>,
}

impl Default for DecalTextures {
    fn default() -> Self {
        DecalTextures {
            name: String::new(),
            variants: Vec::new(),
            preview_path: None,
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
