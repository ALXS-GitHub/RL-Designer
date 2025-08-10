# Sharing Guide

In this part of the guide, we will cover how to structure the files properly for sharing your decals with others, ensure they work correctly with the game but also with the RL-Designer tool.

## File Structure

When sharing your decal, it's important to maintain the conventional file organization to ensure that the RL-Designer tool can correctly identify and apply your decal. Here’s the structure to use :

```
decals/
├── my_decal/
│   ├── variant_1/
│   │   ├── body_diffuse.png
│   │   ├── body_skin.png
│   │   ├── chassis_diffuse.png
│   │   ├── Template.json
│   │   ├── metadata.yaml
│   │   └── ... (other files)
│   └── variant_2/
│       ├── body_diffuse.png
│       ├── body_skin.png
│       ├── chassis_diffuse.png
│       ├── Template.json
│       ├── metadata.yaml
│       └── ... (other files)
└── ... (other decals)
```

Here note that the file naming is not important (except for the `metadata.yaml` file if provided), but the structure is. The RL-Designer tool will consider the parent folder as the decal name, and each variant will be a subfolder containing the necessary files. By variants, we mean a decal for different car models or different versions of the same decal.

Inside each variant folder, you have to include your decal files like diffuse, skin and any other files necessary.

You have to include a `.json` no matter what the name is, but it is recommended to name it `Template.json` to avoid confusion. Warning, if any other `.json` file is present in the variant folder, it will be ignored by the RL-Designer tool and may cause issues, so make sure to only have one `.json` file per variant.

## Template.json

Here is an example of a `Template.json` file that you can use as a reference for your own decals. This is the standard `Template.json` file used by Alpha-Console plugin.

```json
// Template.json example for a car decal
{
    "Decal Name (Variant)": {
		"Group": "My Decal Group", // Optional, can be used to group decals together
		"BodyID": 23,
		"SkinID": 0,
        "Chassis": {
            "Diffuse": "HyperBeast_Chassis.png"
        },
		"Body": {
			"Diffuse": "body_diffuse.png",
			"Skin": "body_skin.png"
		},
    }
}
// Template.json example for a universal decal
{
    "Decal Name (Variant)": {
		"Group": "My Decal Group",
		"BodyID": 23,
		"SkinID": 11609,
		"Chassis": {
			"Diffuse": "chassis_diffuse.png"
		},
		"Body": {
			"1_Diffuse_Skin": "body_diffuse.png",
			"TrimSheet": "TrimSheet.png"
		}
    }
}
// Template.json example for a ball decal
{
	"Decal Name (Variant)": {
		"Group": "My Ball Decal Group", // Optional, can be used to group decals together
		"Params": {
			"Diffuse": "ball_diffuse.png",
		}
	}
}
```

The only think that is really important is the `Decal Name (Variant)` key, which should be the name of your decal variant, and should be unique across all decals that exists. I highly recommend to use the same format as the one used in the example, which is `Decal Name (Variant)`, where `Decal Name` is the name of your decal and `Variant` is the name of the variant. This will help to avoid conflicts with other decals.

The `BodyID` is the ID of the car you are making the decal for. You can search for the car ID on internet, look for other examples, or find it in the game files (Check out the video suggested in the `Designer Guide` for this last option).

The `SkinID` is the ID of the skin you are making the decal for. If you are making a simple decal, keep it to `0`. Indeed `0` means that is will replace the "empty" decal in Rocket League. This parameter is important to change if you consider to create an universal decal as only some skins in game are using the universal uv map. For example `11609` corresponds to "BDS 2025" decal which is universal and could be used. In fact the `SkinID` just correspond to the in game decal that is going to be replaced by your custom decal.

The `Chassis` object contains the `Diffuse` key, which is the name of the chassis diffuse texture file. If you don't have a chassis diffuse texture and keep the normal chassis of the car, you can remove this object.

The `Body` object contains the `Diffuse` and `Skin` keys, which are the names of the body diffuse and skin texture files respectively.

For universal decals, the `Body` object should contain `1_Diffuse_Skin` instead of `Diffuse` and `Skin`. Also the `TrimSheet` correspond to the team logo that is used in game by the universal decals, but if you don't want any `TrimSheet` on your decal, you must specify this field and set it to an image that is completely transparent.

For ball decals, the `Params` object contains the `Diffuse` key, which is the name of the ball diffuse texture file. You can add more parameters if needed, but for now, this is the only one required.

You can also add the `Group` key to group decals under the same group together. This is optional, but can be useful to organize your decals in Alpha-Console. The `Group` key can have multiple sub-groups, just add `/` to create a new sub-group, for example `My Decal Group/Sub Group`.

## Sharing Your Decal

As for now, I am the only maintainer of the RL-Designer tool, so you can share your decal by making a pull request on the [RL-Designer repository](https://github.com/ALXS-GitHub/RL-Designer). Make sure to follow the file structure mentioned above and include your decal files in the correct format. You can place your decal in the `decals/decals` or `decals/ball_textures` folder of the repository.

If you have never made a pull request before, you can follow the [GitHub guide on how to create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

Once your pull request is submitted, I will review it and merge it into the repository if everything is correct + update the index.json file that is used by the RL-Designer tool in order to include your decal. If there are any issues, I will let you know and help you to fix them.