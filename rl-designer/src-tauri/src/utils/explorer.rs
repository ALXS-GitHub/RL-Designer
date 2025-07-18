use reqwest;
use serde::{Deserialize, Serialize};
use crate::types::decal::DecalTextures;
use serde_json::Value;
use crate::constants::GITHUB_DECALS_RAW_URL;

#[derive(Debug, Deserialize)]
pub struct DecalsIndex {
    pub decals: Vec<DecalInfo>,
}

#[derive(Debug, Deserialize)]
pub struct DecalInfo {
    pub name: String,
    pub variants: Vec<VariantInfo>,
    pub preview_path: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct VariantInfo {
    pub variant: String,
    pub files: Vec<String>,
}

pub async fn fetch_decal_index() -> Result<DecalsIndex, String> {
    let index_url = format!("{}/index.json", GITHUB_DECALS_RAW_URL);
    
    let client = reqwest::Client::builder()
        .user_agent("RL-Designer-App/1.0")
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;
    
    // Fetch the index.json file
    let response = client
        .get(&index_url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch decals index: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Failed to fetch decals index: {} - {}", 
            response.status(), 
            response.text().await.unwrap_or_default()
        ));
    }

    let decals_index: DecalsIndex = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse decals index: {}", e))?;

    Ok(decals_index)
}

pub async fn fetch_decals_from_github_raw() -> Result<Vec<DecalTextures>, String> {
    // Fetch the decals index from GitHub
    let decals_index = fetch_decal_index().await?;

    let mut decals = Vec::new();

    // Process each decal from the index
    for decal_info in decals_index.decals {
        let variants: Vec<String> = decal_info.variants
            .iter()
            .map(|v| v.variant.clone())
            .collect();

        if variants.is_empty() {
            continue;
        }

        let preview_path: Option<String> = if let Some(path) = decal_info.preview_path.clone() {
            Some(format!("{}/{}", GITHUB_DECALS_RAW_URL, path))
        } else {
            None
        };

        let decal = DecalTextures {
            name: decal_info.name.clone(),
            variants: variants.clone(),
            preview_path,
            ..DecalTextures::default()
        };

        decals.push(decal);
    }

    // Sort alphabetically for consistency
    decals.sort();

    Ok(decals)
}


