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
│   │   └── ... (other files)
│   └── variant_2/
│       ├── body_diffuse.png
│       ├── body_skin.png
│       ├── chassis_diffuse.png
│       ├── Template.json
│       └── ... (other files)
└── ... (other decals)
```

Here note that the file naming is not important, but the structure is. The RL-Designer tool will consider the parent folder as the decal name, and each variant will be a subfolder containing the necessary files. By variants, we mean a decal for different car models or different versions of the same decal.

Inside each variant folder, you have to include your decal files like diffuse, skin and any other files necessary.

You have to include a `.json` no matter what the name is, but it is recommended to name it `Template.json` to avoid confusion. Warning, if any other `.json` file is present in the variant folder, it will be ignored by the RL-Designer tool and may cause issues, so make sure to only have one `.json` file per variant.

## Template.json

Here is an example of a `Template.json` file that you can use as a reference for your own decals. This is the standard `Template.json` file used by Alpha-Console plugin.

```json
// Template.json example for a car decal
{
    "Decal Name (Variant)": {
		"Group": "My Decal Group", // Optional, can be used to group decals together
		"BodyID": 25,
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

The `SkinID` is the ID of the skin you are making the decal for. If you are making a simple decal, let it to `0`. (And to be honest, I don't know what it is used for, but keep it as `0` for now).

The `Chassis` object contains the `Diffuse` key, which is the name of the chassis diffuse texture file. If you don't have a chassis diffuse texture and keep the normal chassis of the car, you can remove this object.

The `Body` object contains the `Diffuse` and `Skin` keys, which are the names of the body diffuse and skin texture files respectively.

For ball decals, the `Params` object contains the `Diffuse` key, which is the name of the ball diffuse texture file. You can add more parameters if needed, but for now, this is the only one required.

You can also add the "Group" key to group decals under the same group together. This is optional, but can be useful to organize your decals in Alpha-Console.

## Sharing Your Decal

As for now, I am the only maintainer of the RL-Designer tool, so you can share your decal by making a pull request on the [RL-Designer repository](https://github.com/ALXS-GitHub/RL-Designer). Make sure to follow the file structure mentioned above and include your decal files in the correct format. You can place your decal in the `decals/decals` folder of the repository.

If you have never made a pull request before, you can follow the [GitHub guide on how to create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

Once your pull request is submitted, I will review it and merge it into the repository if everything is correct + update the index.json file that is used by the RL-Designer tool in order to include your decal. If there are any issues, I will let you know and help you to fix them.