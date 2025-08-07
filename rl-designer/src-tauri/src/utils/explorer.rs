use crate::constants::GITHUB_DECALS_RAW_URL;
use crate::types::decal::{DecalTextures, VariantFrontInfo};
use crate::types::elements::ElementType;
use reqwest;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Deserialize)]
pub struct DecalsIndex {
    pub decals: Vec<DecalInfo>,
}

#[derive(Debug, Deserialize)]
pub struct DecalInfo {
    pub name: String,
    pub variants: Vec<VariantInfo>,
}

#[derive(Debug, Deserialize)]
pub struct VariantInfo {
    pub variant: String,
    pub signature: String,
    pub files: Vec<String>,
    pub preview_path: Option<String>,
    pub skin_path: Option<String>,
    pub chassis_diffuse_path: Option<String>,
    pub one_diffuse_skin_path: Option<String>,
}

pub async fn fetch_decal_index(element_type: ElementType) -> Result<DecalsIndex, String> {
    let index_url = format!(
        "{}/{}",
        GITHUB_DECALS_RAW_URL,
        element_type.get_index_name()
    );

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
        return Err(format!(
            "Failed to fetch decals index: {} - {}",
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

pub async fn fetch_decals_from_github_raw(
    element_type: ElementType,
) -> Result<Vec<DecalTextures>, String> {
    // Fetch the decals index from GitHub
    let decals_index = fetch_decal_index(element_type).await?;

    let mut decals = Vec::new();

    // Process each decal from the index
    for decal_info in decals_index.decals {
        let variants: Vec<VariantFrontInfo> = decal_info
            .variants
            .into_iter()
            .map(|v| VariantFrontInfo {
                variant_name: v.variant,
                signature: v.signature,
                preview_path: v
                    .preview_path
                    .map(|p| format!("{}/{}", GITHUB_DECALS_RAW_URL, p)),
                skin_path: v
                    .skin_path
                    .map(|p| format!("{}/{}", GITHUB_DECALS_RAW_URL, p)),
                chassis_diffuse_path: v
                    .chassis_diffuse_path
                    .map(|p| format!("{}/{}", GITHUB_DECALS_RAW_URL, p)),
                one_diffuse_skin_path: v
                    .one_diffuse_skin_path
                    .map(|p| format!("{}/{}", GITHUB_DECALS_RAW_URL, p)),
            })
            .collect();

        if variants.is_empty() {
            continue;
        }

        let decal = DecalTextures {
            name: decal_info.name.clone(),
            variants: variants.clone(),
            ..DecalTextures::default()
        };

        decals.push(decal);
    }

    // Sort alphabetically for consistency
    decals.sort();

    Ok(decals)
}
