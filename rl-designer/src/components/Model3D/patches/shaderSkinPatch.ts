import type { ShaderMaterial, WebGLProgramParametersWithUniforms } from "three";

export const shaderSkinPatch = (shader: WebGLProgramParametersWithUniforms) => {

    shader.vertexShader = shader.vertexShader.replace(
    'void main() {',
    `
      varying vec2 vUv;
      void main() {
        vUv = uv;
    `
  );

    shader.fragmentShader = shader.fragmentShader.replace(
    'void main() {',
    `
      varying vec2 vUv;
      uniform sampler2D skinTexture;
      uniform vec3 mainTeamColor;
      uniform vec3 windowsColor;
      void main() {
    `
  );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
        #include <map_fragment>
        vec4 decalColor = texture2D(map, vUv);
        vec4 skinColor = texture2D(skinTexture, vUv);

        vec3 finalColor = decalColor.rgb;
        float alpha = decalColor.a;
        bool isWindow = false;

        if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a < 0.1) {
            finalColor = mainTeamColor;
        }
        else if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a > 0.9) {
            finalColor = decalColor.rgb;
        }
        else if (skinColor.r > 0.15 && skinColor.r < 0.18 && skinColor.g < 0.05 && skinColor.b < 0.05) {
            finalColor = decalColor.rgb;
        }
        else if (skinColor.b > 0.9 && skinColor.r < 0.1 && skinColor.g < 0.1) {
            finalColor = windowsColor;
            isWindow = true;
        }

        if (isWindow) {
            alpha = alpha * 0.8;
        }

        diffuseColor = vec4(finalColor, alpha);
      `
    );
};