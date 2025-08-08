import type { ShaderMaterial, WebGLProgramParametersWithUniforms } from "three";

export const shaderSkinPatch = (shader: WebGLProgramParametersWithUniforms) => {

    shader.vertexShader = shader.vertexShader.replace(
    'void main() {',
    `
      varying vec2 vUv;
      #ifdef USE_UV1
        varying vec2 vUv1;
      #endif
      void main() {
        vUv = uv;
        #ifdef USE_UV1
          vUv1 = uv1;
        #endif
    `
  );

    shader.fragmentShader = shader.fragmentShader.replace(
    'void main() {',
    `
      varying vec2 vUv;
      #ifdef USE_UV1
        varying vec2 vUv1;
      #endif
      uniform sampler2D skinTexture;
      uniform sampler2D curvatureTexture;
      uniform vec3 mainTeamColor;
      uniform vec3 windowsColor;
      uniform vec3 carColor;
      void main() {
    `
  );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
        #include <map_fragment>
        #ifdef USE_UV1
          vec4 decalColor = texture2D(map, vUv1);
        #else
          vec4 decalColor = texture2D(map, vUv);
        #endif
        vec4 skinColor = texture2D(skinTexture, vUv);
        vec4 curvatureColor = texture2D(curvatureTexture, vUv);
        
        vec3 finalColor = decalColor.rgb;
        float alpha = decalColor.a;
        bool isWindow = false;
        bool isCarColorPart = false;

        // Check if this pixel is car body (green in curvature texture)
        // Green ranges from ~0.48 (0x7b/255) to 1.0 (0xff/255)
        // Purple has low green values (~0.0 to ~0.2)
        if (curvatureColor.g > 0.4) {
            isCarColorPart = true;
        }

        // If pixel is part of the main team color part
        if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a < 0.1) {
            finalColor = mainTeamColor;
        }
        // If pixel is part of the decal
        else if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a > 0.9) {
            finalColor = decalColor.rgb;
        }
        else if (skinColor.r > 0.15 && skinColor.r < 0.18 && skinColor.g < 0.05 && skinColor.b < 0.05) {
            finalColor = decalColor.rgb;
        }

        // If pixel is part of the window
        else if (skinColor.b > 0.9 && skinColor.r < 0.1 && skinColor.g < 0.1) {
            isWindow = true;
        }
          
        if (isCarColorPart) { // If pixel is part of the changeable car color part
            finalColor = carColor;
            alpha = 1.0;
        }

        if (isWindow) { // If pixel is part of the window
            finalColor = windowsColor;
            alpha = alpha * 0.8;
        }

        diffuseColor = vec4(finalColor, alpha);
      `
    );
};