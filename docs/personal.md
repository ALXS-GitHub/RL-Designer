# RL-Designer

## To watch

For Extra UV : https://youtu.be/RzjcdV1sK-k?si=mOmF4sfmFf1eY8Ed

Universal decal : https://youtu.be/L5YTrhEHeNs?si=SEn4Gm_C6t7tgMQA

## Personal Thoughts

Apparently `BodyID` set to 0 or -1 (Don't know the diff yet, if there is one..., maybe 0 is classical universal and -1 is the 2025 universal (especially made to have a team logo)) correspond to Universal Decal, so it can be used for any car.

I think `SkinID` Can be used to override some parts of existing skins. 0 correspond to no skin, but for 1059 corresponds to "Dragon Lord" skin, and if we only override the Decal part (fixed dragon part), it will still show the animated confetti on the car. 

---

## Instruction on how to make a decal

TODO: Complete the instruction, for the moment, only the most important steps are listed.

### Creating a sticker

#### Gimp tips

##### Making a full opaque sticker with a transparent background

In order to make a full opaque sticker with a transparent background, the first thing you have to do is to remove the background with common methods like color selection, magic wand, ...
After this the border pixels of your sticker may have some transparency and we have to fix this. To do this select the whole image and Right Click -> Layer -> Transparency -> Alpha Channel Threshold. Make sure you are setting it to Replace mode with 100% opacity, and then you can adjust the threshold in order to select the pixels that are transparent.

!!! For this to work in blender directly without doing any other manipulation, make sure to uncheck the 'Interpolation' in the Sampling panel that is in the Image panel of the Texture tab.

### Skin Image

The skin image determines how the colors should be displayed on the decal (for example the team color, windows, ...).

The Main Team Color is in `0 opacity red` !
The Secondary Color is in `red` !

#### Tutorial on GIMP

In order to make the `0 opacity red` color, you have to make a new layer with `#FF0000` (red) as the main color. Then you have to add a mask with options 'White (full opacity)'. Then click on this mask and fill it with black so the layer become transparent. Finally when you want to save the image, MAKE SURE TO SAVE THE COLORS FOR THE TRANSPARENCY.

### Diffuse Image

It may be useful in Blender to separate the the background of the decal from the image you want to apply so you can directly have the decal on a transparent background and use it more easily later.

#### Tips

For a more efficient brush, you can select the square brush in the Falloff section of the Brush panel.

#### Alpha issues fix

Also you may have to change the transparency of the stencil when applying it so you don't have any alpha issues. 

There are two steps to do this :

First step is to create a mask "like" to specify the zone to apply the decal. We are going to paint a full white zone that only consist of the 100% alpha pixels in our image.

To do this we first have to duplicate our image to create a second texture with it (this will be our mask). Now in the Texture (first check if alpha is checked) go to Colors then check Color Ramp and specify Constant for the interpolation. The first must be set as white with 0% alpha and the second trigger should be set to white with 100% alpha (i think the first trigger can also work with black). Then you can position the second trigger to manage the desired alpha threshold (if you want to adjust the alpha level a bit).

Now apply this as you would apply a decal in blender. This will paint a full white zone. Now make sure that you don't move and don't change the stencil. Go either to brush or Texture and change the texture that you want to apply (this is the image with the regular colors and the alpha part that we don't want to apply). Now in the Brush select Multiply for the Blend, this will allow to only apply the color on the white zone.

Here you go, you have a perfect opaque decal on a transparent background.
