use serde::{Serialize, Deserialize};
use serde_json::{Value, Map};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum ElementType {
    #[serde(alias = "car")]
    Car,
    #[serde(alias = "ball")]
    Ball,
    #[serde(alias = "wheel")]
    Wheel,
    #[serde(alias = "boost_meter")]
    BoostMeter,
}

#[derive(Debug, Serialize)]
pub struct Pattern {
    pub preview_path: String, // body_diffuse or other
    pub skin_path: Option<String>,
    pub chassis_diffuse_path: Option<String>,
    pub one_diffuse_skin_path: Option<String>,
    pub imageseq_subuv_path: Option<String>, // for looper wheel textures
}

impl ElementType {
    pub fn get_folder_name(&self) -> &'static str {
        match self {
            ElementType::Car => "DecalTextures",
            ElementType::Ball => "BallTextures",
            ElementType::Wheel => "WheelTextures", // not supported yet
            ElementType::BoostMeter => "BoostMeterTextures",
        }
    }

    pub fn get_git_folder_name(&self) -> &'static str {
        match self {
            ElementType::Car => "decals",
            ElementType::Ball => "ball_textures",
            ElementType::Wheel => "wheel_textures", // not supported yet
            ElementType::BoostMeter => "boost_meter_textures",
        }
    }

    pub fn get_index_name(&self) -> &'static str {
        match self {
            ElementType::Car => "index.json",
            ElementType::Ball => "ball_index.json",
            ElementType::Wheel => "wheel_index.json", // not supported yet
            ElementType::BoostMeter => "boost_meter_index.json",
        }
    }

    pub fn get_pattern(&self) -> Pattern {
        match self {
            ElementType::Car => Pattern {
                preview_path: "Body.Diffuse".to_string(),
                skin_path: Some("Body.Skin".to_string()),
                chassis_diffuse_path: Some("Chassis.Diffuse".to_string()),
                one_diffuse_skin_path: Some("Body.1_Diffuse_Skin".to_string()),
                ..Pattern::default()
            },
            ElementType::Ball => Pattern {
                preview_path: "Params.Diffuse".to_string(),
                ..Pattern::default()
            },
            ElementType::Wheel => Pattern {
                preview_path: "Params.Texture_Diffuse".to_string(),
                imageseq_subuv_path: Some("Params.ImageSeq_SubUV".to_string()),
                ..Pattern::default()
            },
            ElementType::BoostMeter => Pattern {
                preview_path: "Fill".to_string(),
                ..Pattern::default()
            },
        }
    }
}

impl Pattern {
    // function to iterate the pattern fields and values
    pub fn iterate(&self) -> Map<String, Value> {
        let v = serde_json::to_value(self).expect("serialize");
        let x= v.as_object().expect("object").clone();
        x
    }
}

impl Default for Pattern {
    fn default() -> Self {
        Pattern {
            preview_path: "Body.Diffuse".to_string(),
            skin_path: None,
            chassis_diffuse_path: None,
            one_diffuse_skin_path: None,
            imageseq_subuv_path: None,
        }
    }
}

