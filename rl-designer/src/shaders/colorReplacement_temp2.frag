#define MAX_DIR_LIGHTS 10

uniform sampler2D decalTexture;
uniform sampler2D skinTexture;
uniform vec3 mainTeamColor;
uniform vec3 windowsColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];

void main() {
    vec4 decalColor = texture2D(decalTexture, vUv);
    vec4 skinColor = texture2D(skinTexture, vUv);

    vec3 finalColor = decalColor.rgb;
    float alpha = decalColor.a;
    bool isWindow = false;

    // Check skin color to determine what to replace
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

    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    vec3 diffuseLight = vec3(0.0);
    for (int i = 0; i < MAX_DIR_LIGHTS; i++) {
        #if (MAX_DIR_LIGHTS > 0)
        vec3 lightDir = normalize(directionalLightDirection[i]);
        float diff = max(dot(normal, -lightDir), 0.0);
        diffuseLight += directionalLightColor[i] * diff;
        #endif
    }
    // Add a minimum ambient
    diffuseLight = max(diffuseLight, vec3(0.2));
    
    if (isWindow) {
        // Glass-like rendering for windows with stronger reflections
        
        // Enhanced Fresnel effect - more reflective at grazing angles
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 1.5);
        fresnel = clamp(fresnel, 0.4, 0.95); // Increased minimum reflection
        
        // Create reflection effect using normal
        vec3 reflectionDir = reflect(-viewDir, normal);
        
        // Enhanced sky reflection with more intensity
        float skyIntensity = abs(reflectionDir.y) * 0.6 + 0.4;
        vec3 skyColor = mix(vec3(0.3, 0.6, 1.0), vec3(0.9, 0.95, 1.0), skyIntensity);
        
        // Stronger environment reflection
        vec3 envReflection = skyColor * fresnel;
        
        // Reduced base window tint (less of the original color shows through)
        vec3 baseTint = finalColor * (1.0 - fresnel * 0.9);
        
        // Combine with stronger reflection influence
        finalColor = mix(baseTint, envReflection, fresnel * 0.85);
        
        // Much stronger specular highlights
        vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
        vec3 lightDir2 = normalize(vec3(-1.0, 1.0, 0.5));
        
        // Multiple specular highlights for more realistic glass
        vec3 reflectDir1 = reflect(-lightDir1, normal);
        vec3 reflectDir2 = reflect(-lightDir2, normal);
        
        float spec1 = pow(max(dot(viewDir, reflectDir1), 0.0), 128.0); // Higher exponent for sharper reflection
        float spec2 = pow(max(dot(viewDir, reflectDir2), 0.0), 64.0);
        
        // Stronger specular contribution
        finalColor += vec3(1.0) * (spec1 * 0.6 + spec2 * 0.3);
        
        // Reduced transparency - windows are much less transparent
        alpha = alpha * 0.95 + fresnel * 0.05; // Much less transparent
        
    } else {
        // Regular car body lighting
        // float lightFactor = 0.5 + 0.5 * abs(normal.z);
        // lightFactor += 0.2 * abs(normal.x) + 0.1 * abs(normal.y);
        // lightFactor = clamp(lightFactor, 0.4, 1.0);
        // finalColor = finalColor * lightFactor;
        finalColor = finalColor;
    }
    
    gl_FragColor = vec4(finalColor, alpha);
}