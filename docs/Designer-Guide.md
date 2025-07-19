# Designer Guide

## Introduction

Rocket League Designer doesn't provide an integrated designer, so you will have to use an external image editor like GIMP or Photoshop to create your decals. Also if you want to using a 3D software like Blender to create your decals is highly recommended, as it will allow you to see how your decal will look like in the game, and also to create more complex decals with 3D models.
This guide will help you understand how to create decals and how to use them in Rocket League Designer.

## Requirements

- 2D image editor (GIMP, Photoshop, etc.)
- 3D software (Blender, etc.) - optional but recommended
- Basic knowledge of image editing and 3D modeling

In this guide, we will focus on GIMP as the 2D image editor and Blender as the 3D software, but you can use any other software that you are comfortable with.

## Creating a Decal

Multiple layers are used in Rocket League decals, and each layer has a specific purpose. The main layers are:

- **Skin** - This layer determines how the colors should be displayed on the decal (for example, team color, windows, etc.).
- **Diffuse** - This layer contains the main design of the decal, which will be applied to the car. For example the image of the decal itself.

Those layers are used for both the chassis and the Body of the car. On this tutorial we will focus on the Body of the car, but the same principles apply to the chassis.

Warning: The skin image determines how the colors should be displayed on the decal, so it is important to make sure that the skin matches the diffuse image properly so the image you want to display will appear correctly on the car.

### Diffuse Image

Let's start with the diffuse image, which is the main design of the decal. This image will be applied to the car's body. 
Why starting with the diffuse image? Because it is the most important part of the decal, and it will be used to create the skin image later on (for example just filling the skin image on the areas where the diffuse image is applied).

TODO : complete with tutorial on how to load the model in Blender.

Let's start creating the sticker in Blender. Here you will have to load the car body's model, and create a new material for the decal. (...to complete...)

TODO : complete with tutorial on how to create the texture in Blender

I recommend using a template decal image with a with a monochrome color (like green as it will act as a green screen when we will extract the skin image later on) so you can easily see the areas where the decal will be applied.
Make sure this template decal is another layer than your main decal image so you can easily extract the decal part when saving the diffuse image.

TODO : complete with tutorial on how to apply the decal in blender

### Skin Image

The skin image determines how the colors should be displayed on the decal (for example, team color, windows, etc.).

Here are the main colors used in Rocket League decals:
- **Main Team Color**: This is represented in the skin image as `0 opacity red`, `#FF000000` (a fully transparent red). ⚠️ Many software will not allow you to use a fully transparent color and will overwrite it with `#00000000` (a fully opaque black), so we will have to use a workaround to create this color (see the tutorial below).
- **Secondary Color**: This is represented in the skin image as `red`, `#FF0000` (a fully opaque red).
- **Windows Color**: This is represented in the skin image as `blue`, `#0000FF` (a fully opaque blue).

TODO : `2b0000` for what color ???