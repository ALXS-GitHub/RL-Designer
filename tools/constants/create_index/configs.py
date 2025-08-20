TEXTURE_CONFIGS = {
    "decals": {
        "dir": "decals",
        "output": "index.json",
        "display_name": "Decals",
        "patterns": {
            "diffuse_pattern": "Body.Diffuse",
            "skin_pattern": "Body.Skin",
            "chassis_diffuse_pattern": "Chassis.Diffuse",
            "one_diffuse_skin_pattern": "Body.1_Diffuse_Skin"
        }  
    },
    "balls": {
        "dir": "ball_textures",
        "output": "ball_index.json",
        "display_name": "Balls",
        "patterns": {
            "diffuse_pattern": "Params.Diffuse"
        }
    },
    "wheels": {
        "dir": "wheel_textures", 
        "output": "wheel_index.json",
        "display_name": "Wheels",
        "patterns": {
            "diffuse_pattern": "Params.Texture_Diffuse",
            "imageseq_subuv_pattern": "Params.ImageSeq_SubUV"
        }
    },
    "boost_meters": {
        "dir": "boost_meter_textures",
        "output": "boost_meter_index.json",
        "display_name": "Boost Meters",
        "patterns": {
            "diffuse_pattern": "Fill"
        }
    }
}