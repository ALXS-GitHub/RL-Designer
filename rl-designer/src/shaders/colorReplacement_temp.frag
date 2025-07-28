#define PHONG
#define USE_PHONG

uniform sampler2D decalTexture;
uniform sampler2D skinTexture;
uniform vec3 mainTeamColor;
uniform vec3 windowsColor;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform float specularStrength;

varying vec2 vUv;
varying vec3 vNormal;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
// #include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
// #include <specularmap_pars_fragment>

void main() {
    vec4 decalColor = texture2D(decalTexture, vUv);
    vec4 skinColor = texture2D(skinTexture, vUv);

    vec3 finalColor = decalColor.rgb;
    float alpha = decalColor.a;
    bool isWindow = false;

    if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a < 0.1) {
        finalColor = mainTeamColor;
    } else if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a > 0.9) {
        finalColor = decalColor.rgb;
    } else if (skinColor.r > 0.15 && skinColor.r < 0.18 && skinColor.g < 0.05 && skinColor.b < 0.05) {
        finalColor = decalColor.rgb;
    } else if (skinColor.b > 0.9 && skinColor.r < 0.1 && skinColor.g < 0.1) {
        finalColor = windowsColor;
        isWindow = true;
    }

    // Set the base diffuseColor for the Phong lighting
    vec4 diffuseColor = vec4(finalColor, alpha);

    ReflectedLight reflectedLight;
    reflectedLight.directDiffuse = vec3(0.0);
    reflectedLight.directSpecular = vec3(0.0);
    reflectedLight.indirectDiffuse = vec3(0.0);
    reflectedLight.indirectSpecular = vec3(0.0);

    vec3 totalEmissiveRadiance = emissive;

    #include <lights_phong_fragment>

    vec3 outgoingLight = reflectedLight.directDiffuse +
                         reflectedLight.indirectDiffuse +
                         reflectedLight.directSpecular +
                         reflectedLight.indirectSpecular +
                         totalEmissiveRadiance;

    if (isWindow) {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(-vViewPosition); // use vViewPosition defined by Three.js internally

        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 1.5);
        fresnel = clamp(fresnel, 0.4, 0.95);

        vec3 reflectionDir = reflect(-viewDir, normal);
        float skyIntensity = abs(reflectionDir.y) * 0.6 + 0.4;
        vec3 skyColor = mix(vec3(0.3, 0.6, 1.0), vec3(0.9, 0.95, 1.0), skyIntensity);
        vec3 envReflection = skyColor * fresnel;

        vec3 baseTint = finalColor * (1.0 - fresnel * 0.9);
        finalColor = mix(baseTint, envReflection, fresnel * 0.85);

        vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
        vec3 lightDir2 = normalize(vec3(-1.0, 1.0, 0.5));

        vec3 reflectDir1 = reflect(-lightDir1, normal);
        vec3 reflectDir2 = reflect(-lightDir2, normal);

        float spec1 = pow(max(dot(viewDir, reflectDir1), 0.0), 128.0);
        float spec2 = pow(max(dot(viewDir, reflectDir2), 0.0), 64.0);

        finalColor += vec3(1.0) * (spec1 * 0.6 + spec2 * 0.3);
        alpha = alpha * 0.95 + fresnel * 0.05;

        outgoingLight = finalColor; // override lighting for windows
    }

    gl_FragColor = vec4(outgoingLight, alpha);

    #include <tonemapping_fragment>
    // #include <encodings_fragment>
    #include <fog_fragment>
    #include <dithering_fragment>
}
