#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ElementType {
    Car,
    Ball,
    // Wheel, // not supported yet
}

pub struct BodyDiffuseType {
    pub body: String,
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

    pub fn get_body_diffuse(&self) -> BodyDiffuseType {
        match self {
            ElementType::Car => BodyDiffuseType {
                body: "Body".to_string(),
                diffuse: "Diffuse".to_string(),
            },
            ElementType::Ball => BodyDiffuseType {
                body: "Params".to_string(),
                diffuse: "Diffuse".to_string(),
            },
            // ElementType::Wheel => BodyDiffuseType { body: "Wheel".to_string(), diffuse: "Diffuse".to_string() }, // not supported yet
        }
    }
}