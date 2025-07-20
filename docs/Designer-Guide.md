# Designer Guide

## Introduction

Rocket League Designer doesn't provide an integrated designer, so you will have to use an external image editor like GIMP or Photoshop to create your decals. Also if you want to using a 3D software like Blender to create your decals is highly recommended, as it will allow you to see how your decal will look like in the game, and also to create more complex decals with 3D models.
This guide will help you understand how to create decals and how to use them in Rocket League Designer.

## Requirements

- 2D image editor (GIMP, Photoshop, etc.)
- 3D software (Blender, etc.) - optional but recommended
- Basic knowledge of image editing and 3D modeling

In this guide, we will focus on GIMP as the 2D image editor and Blender as the 3D software, but you can use any other software that you are comfortable with.

## Before You Start

Here are some video tutorials that I recommend watching if this tutorial is not enough for you:
- [HOW TO: Blender set up for Rocket League cars | Custom Decals](https://www.youtube.com/watch?v=kqnoKMSz9yM)

## Creating a Decal

Multiple layers are used in Rocket League decals, and each layer has a specific purpose. The main layers are:

- **Skin** - This layer determines how the colors should be displayed on the decal (for example, team color, windows, etc.).
- **Diffuse** - This layer contains the main design of the decal, which will be applied to the car. For example the image of the decal itself.

Those layers are used for both the chassis and the Body of the car. On this tutorial we will focus on the Body of the car, but the same principles apply to the chassis.

For a better quality, I recommend using 2048x2048 images for the diffuse and skin layers.

Warning: The skin image determines how the colors should be displayed on the decal, so it is important to make sure that the skin matches the diffuse image properly so the image you want to display will appear correctly on the car.

You can find any of my template at [https://github.com/ALXS-GitHub/RL-Designer/tree/main/decals/templates](https://github.com/ALXS-GitHub/RL-Designer/tree/main/decals/templates) for the 3D models and [https://github.com/ALXS-GitHub/RL-Designer/tree/main/decals/decals/Templates](https://github.com/ALXS-GitHub/RL-Designer/tree/main/decals/decals/Templates) for the images. You can use them as a starting point for your decals.

### Preparing the Decal

Before you start creating your decal, you need to prepare the images that will be used for the diffuse and skin layers.

First of all, download any image you want and we are going to prepare it by removing the background and making it transparent.

On you image editor, you need to make sure that the image allow the transparency by adding an alpha channel to the image. In GIMP, you can do this by going to `Layer` > `Transparency` > `Add Alpha Channel`. 

![](images/2025-07-20-11-36-49.png)

Now select the select by color tool and select the background color you want to remove. (You can also use the magic wand tool if you prefer). You can either select the background by color, or by alpha channel. Here we are going to select the background, using a low threshold to select only pixels that are similar to the background color. Then enter "Delete" to remove the background.

Extra tip : In the "Select" menu, you can use the "Grow" or "Shrink" options to adjust the selection area if needed. This can help you to avoid leaving any unwanted pixels around the edges of your decal. Also if some pixels are selected but inside the decal, you can use a technique called "Morphological Closing" that consist of first shrinking the selection by a few pixels, then growing it back to the original size. This will help you to remove any unwanted holes.

![](images/2025-07-20-11-41-11.png)

Then you can save the image as a PNG file to preserve the transparency. In GIMP, you can do this by going to `File` > `Export As...` and selecting PNG as the file format. (Note : you can see that there is an option to save the alpha channel colors, it is not needed in this step, but later in the process we will need to use it).

![](images/2025-07-20-11-43-30.png)

Perfect! Now you can make the same for all the images you want to use in your decal and you are ready to start creating your decal.

### Diffuse Image

Let's start with the diffuse image, which is the main design of the decal. This image will be applied to the car's body. 
Why starting with the diffuse image? Because it is the most important part of the decal, and it will be used to create the skin image later on (for example just filling the skin image on the areas where the diffuse image is applied).

TODO : complete with tutorial on how to load the model in Blender.

Let's start creating the sticker in Blender. Here you will have to load the car body's model, and create a new material for the decal. (...to complete...)

TODO : complete with tutorial on how to create the texture in Blender

I recommend using a template decal image with a with a monochrome color (like green as it will act as a green screen when we will extract the skin image later on) so you can easily see the areas where the decal will be applied.
Make sure this template decal is another layer than your main decal image so you can easily extract the decal part when saving the diffuse image. Here in this example you can see that we are using two layers: one for the background (Undefined) and the other one for the decal itself (Image)

![](images/2025-07-19-22-11-42.png)

In order to have the two layers shown at the same time when editing, I recommend using the "Material Preview", mode for the Viewport Shading, and if the lighting feels weird or too dark, you can click on the down arrow next to it, and modify the scene elements to your liking.

![](images/2025-07-19-22-13-06.png)
![](images/2025-07-20-11-57-45.png)

Please, when you start editing, don't forget to switch to the proper UV map, so you don't edit the background UV map by mistake.

You can then start painting colors with the brush tool any way you want. 

![](images/2025-07-19-22-15-36.png)

However what interests us the most in this tutorial is how to apply images on the decal.

First you need to create a new texture. For this go in the "Texture" tab, and click on the "New" button. Then you can select the image you want to use as a texture (open folder and select your image).

![](images/2025-07-20-11-59-31.png)

Now In the "Tool" tab, go in the "Texture" section, select the texture you just created, and make sure you are using the mapping to "Stencil", this will allow you to use the image as a mask for the decal. You can move around the stencil using the `right mouse button`, rotate it by pressing `ctrl + right mouse button`, and scale it by pressing `shift + right mouse button`. Also don't forget to reset the "Image Aspect" so the image is not stretched weirdly.

Now when applying the texture, make sure that you are using `#FFFFFF` (white) as the color, and `Mix` as the blend mode. This will allow you to apply the texture on the decal.

![](images/2025-07-20-12-28-45.png)

Once finished, you can save the diffuse image by going to `Image` > `Save` and selecting PNG as the file format. Make sure to save it in the same folder as the template decal image so you can easily find it later. When saving, I recommend using a name similar to `<car_name|sticker_name>_diffuse.png` (for example `oct_diffuse.png`), so you can easily identify it later. (If you do this with the chassis, you can use `<car_name|sticker_name>_chassis_diffuse.png`).

![](images/2025-07-20-12-33-37.png)

Note : If you also save your blender project at this point, it will automatically use the saved diffuse image as the texture for the decal, so you can easily see how it looks on the car.

One last thing I would highly recommend is to keep a copy of the diffuse image and name it something like "no background" version as the final diffuse image will have a black background but this could be annoying when we are going to use our diffuse image as a template for the skin image.

The final step is the fill the background of the diffuse image in black in the 2D image editor (make sure you have your no background copy saved before doing this) : 

![](images/2025-07-20-19-16-00.png)

Last tip, since blender still paint some lower alpha pixels, I recommend to directly go in your 2D image editor and select the decal part of the diffuse image and fill it with the 100% opaque color you want to use for the decal. To do this, right click the layer, then add a new layer mask with "Transfer Alpha Channel" option. Then bucket fill the mask with white color, and finally right click the layer again and select "Apply Layer Mask". This will ensure that the decal is fully opaque and ready to be used in Rocket League Designer.
There is an alternative way to do this in Blender : Select the "add alpha" paint mode and paint all the decal with white color. This will ensure that the decal is fully opaque, but it will make a black background. You can finally remove this black background by selecting the background color and deleting it in your 2D image editor.

Even thought those approaches work, there is still a better way to make sure every pixel is fully opaque directly in Blender.

First make sure to use Falloff -> Constant in the Brush panel. 

![](images/2025-07-20-14-58-05.png)

Then create a copy of you texture and enable the "Color Ramp" option with mode "Constant" (!! Very important !!) (Please don't forget to set to "Constant" Too). Now you can set the first trigger to black (or white) with 0% alpha and the second trigger to white with 100% alpha. This will allow you to paint only the pixels that are fully opaque. Paint this texture with Mix mode. Keep the first trigger at 0, and move the second triger to adjust the alpha threshold. The more the second trigger is to the right, the less pixels will be painted, and the more it is to the left, the more pixels will be painted (more likely pixels that are supposed to be transparent in this case)

![](images/2025-07-20-15-05-09.png)

Then you need to take your original image back and apply it with the "Multiply" mode (Please make sure you don't forget to switch properly between those modes to make sure the decals are applied properly). This will allow you to apply the original image only on the pixels that are fully opaque, and will ensure that the decal is fully opaque. (Make sure you didn't move the stencil in between, otherwise you will have to redo the first step). In fact multiply mode is used to multiply the color of the image already painted with the color of the image you are applying, so if the first image is white, the white pixels will be multiplied by the second image, and the black/transparent pixels will not be affected. This will ensure that only the pixels that are fully opaque will be painted with the original image.

![](images/2025-07-20-15-06-51.png)

Those steps might be a bit hard to understand at first, but the more you practice, the easier it will become.

### Skin Image

The skin image determines how the colors should be displayed on the decal (for example, team color, windows, etc.).

Here are the main colors used in Rocket League decals:
- **Main Team Color**: This is represented in the skin image as `0 opacity red`, `#FF000000` (a fully transparent red). ⚠️ Many software will not allow you to use a fully transparent color and will overwrite it with `#00000000` (a fully opaque black), so we will have to use a workaround to create this color (see the tutorial below).
- **Secondary Color**: This is represented in the skin image as `red`, `#FF0000` (a fully opaque red).
- **Decal Color**: This is represented in the skin image as `#2b0000`. What I call decal color here is the color that specify that we should use the exact color of the decal image, and that is not influenced by the team color.
- **Windows Color**: This is represented in the skin image as `blue`, `#0000FF` (a fully opaque blue).

TODO : `2b0000` for what color ???

The first step I would recommend before starting the skin image is to create a default skin image with the windows in blue. For this go back in blender and color in blue the areas where the windows are, and then save the image as `<car_name|sticker_name>_skin.png` (for example `oct_skin.png`). This will be the base skin image that you will use to create the skin image for your decal.

![](images/2025-07-20-13-58-27.png)

After that, since blender still paint some lower alpha pixels, I recommend to directly select the window part of the skin image and fill it with the 100% opaque blue color. For that just use the select by color tool and select the blue color (`#0000FF`), then fill it with the blue color using the bucket fill tool.

Now the next part is one of the most important parts, as it will require to make sure that the skin image matches the diffuse image properly so the image you want to display will appear correctly on the car.

For this, you will first need to open the diffuse image you created earlier as a new layer in your image editor. In GIMP, you can do this by going to `File` > `Open as Layers...` and selecting the diffuse image file.

Then select all the pixels on this new layer and fill them with `2b0000` (or any other color if you want team colors to be applied later, but for this tutorial we consider that the logo is not influenced by the team colors).

![](images/2025-07-20-15-31-12.png)

In order to make the `0 opacity red` color, you have to make a new layer with `#FF0000` (red) as the main color (Make sure this is either your main or secondary color, so you fill the new mask with this color). 

![](images/2025-07-20-15-30-19.png)

Then you have to add a mask with options 'White (full opacity)'.

![](images/2025-07-20-17-40-59.png)

Then click on this mask and fill it with black so the layer become transparent.

![](images/2025-07-20-17-41-22.png)

Finally when you want to save the image, MAKE SURE TO SAVE THE COLORS FOR THE TRANSPARENCY.

![](images/2025-07-20-17-41-50.png)

## Tips

### GIMP Tips

### Blender Tips

In blender, you can softly rotate the camera any way to want using the numpad keys. For example, you can use `numpad 1` to look at the front of the car, `numpad 3` to look at the right side, and `numpad 7` to look from above. You can also use `numpad 5` to switch between perspective and orthographic view. Any other key will rotate the camera in a more free way, but you can also use the `Ctrl` key to move the camera instead of rotating it. 

When painting, I recommend using a square brush in the Falloff section of the Brush panel for a more efficient brush. 

![](images/2025-07-20-13-03-44.png)

