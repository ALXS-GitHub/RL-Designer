use crate::constants::GITHUB_DECALS_RAW_URL;
use crate::types::decal::{DecalInfo, VariantInfo, DecalsIndex};
use crate::types::elements::ElementType;
use crate::utils::download::get_decal_file_url;
use reqwest;

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
) -> Result<Vec<DecalInfo>, String> {
    // Fetch the decals index from GitHub
    let decals_index = fetch_decal_index(element_type).await?;

    let mut decals = Vec::new();

    // TODO do a function that processes all needed files here
    // Process each decal from the index
    for decal_info in decals_index.decals {
        let variants: Vec<VariantInfo> = decal_info
            .variants
            .into_iter()
            .map(|v| VariantInfo {
                variant_name: v.variant_name.clone(),
                files: v.files.into_iter().map(|f| {
                    get_decal_file_url(element_type, &decal_info.name, &v.variant_name, &f)
                }).collect(),
                signature: v.signature,
                preview_path: v
                    .preview_path
                    .map(|p| get_decal_file_url(element_type, &decal_info.name, &v.variant_name, &p)),
                skin_path: v
                    .skin_path
                    .map(|p| get_decal_file_url(element_type, &decal_info.name, &v.variant_name, &p)),
                chassis_diffuse_path: v
                    .chassis_diffuse_path
                    .map(|p| get_decal_file_url(element_type, &decal_info.name, &v.variant_name, &p)),
                one_diffuse_skin_path: v
                    .one_diffuse_skin_path
                    .map(|p| get_decal_file_url(element_type, &decal_info.name, &v.variant_name, &p)),
            })
            .collect();

        if variants.is_empty() {
            continue;
        }

        let decal = DecalInfo {
            name: decal_info.name.clone(),
            variants: variants.clone(),
        };

        decals.push(decal);
    }

    // Sort alphabetically for consistency
    decals.sort();

    Ok(decals)
}
