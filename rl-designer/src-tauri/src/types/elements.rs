#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ElementType {
    Car,
    Ball,
    // Wheel, // not supported yet
}

pub struct BodyJSONType {
    pub body: String,
    pub diffuse: String,
    pub one_diffuse_skin: String,
    pub skin: String,
}

pub struct ChassisJSONType {
    pub chassis: String,
    pub diffuse: String,
}

impl ElementType {
    pub fn get_folder_name(&self) -> &'static str {
        match self {
            ElementType::Car => "DecalTextures",
            ElementType::Ball => "BallTextures",
            // ElementType::Wheel => "WheelTextures", // not supported yet
        }
    }

    pub fn get_git_folder_name(&self) -> &'static str {
        match self {
            ElementType::Car => "decals",
            ElementType::Ball => "ball_textures",
            // ElementType::Wheel => "wheel_textures", // not supported yet
        }
    }

    pub fn get_index_name(&self) -> &'static str {
        match self {
            ElementType::Car => "index.json",
            ElementType::Ball => "ball_index.json",
            // ElementType::Wheel => "wheel_index.json", // not supported yet
        }
    }

    pub fn get_body_diffuse(&self) -> BodyJSONType {
        match self {
            ElementType::Car => BodyJSONType {
                body: "Body".to_string(),
                diffuse: "Diffuse".to_string(),
                skin: "Skin".to_string(),
                one_diffuse_skin: "1_Diffuse_Skin".to_string(),
            },
            ElementType::Ball => BodyJSONType {
                body: "Params".to_string(),
                diffuse: "Diffuse".to_string(),
                skin: "Skin".to_string(),
                one_diffuse_skin: "".to_string(), 
            },
            // ElementType::Wheel => BodyDiffuseType { body: "Wheel".to_string(), diffuse: "Diffuse".to_string() }, // not supported yet
        }
    }

    pub fn get_chassis_diffuse(&self) -> ChassisJSONType {
        match self {
            ElementType::Car => ChassisJSONType {
                chassis: "Chassis".to_string(),
                diffuse: "Diffuse".to_string(),
            },
            _ => ChassisJSONType {
                // not applicable for other types
                chassis: String::new(),
                diffuse: String::new(),
            },
        }
    }
}
