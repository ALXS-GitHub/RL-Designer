uniform sampler2D decalTexture;
uniform sampler2D skinTexture;
uniform vec3 mainTeamColor;
uniform vec3 windowsColor;

varying vec2 vUv;

void main() {
    vec4 decalColor = texture2D(decalTexture, vUv);
    vec4 skinColor = texture2D(skinTexture, vUv);

    vec3 finalColor = decalColor.rgb;
    float alpha = decalColor.a;

    // Check skin color to determine what to replace
    // Main Team Color: Transparent red (#FF000000)
    if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a < 0.1) {
        finalColor = mainTeamColor;
    }
    // Secondary Color: Red (#FF0000) - for future implementation
    else if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a > 0.9) {
        // Keep secondary color unchanged for now, or implement secondary color logic
        finalColor = decalColor.rgb;
    }
    // Decal Color: Dark red (#2b0000) - keep original decal color
    else if (skinColor.r > 0.15 && skinColor.r < 0.18 && skinColor.g < 0.05 && skinColor.b < 0.05) {
        finalColor = decalColor.rgb;
    }
    // Windows Color: Blue (#0000FF)
    else if (skinColor.b > 0.9 && skinColor.r < 0.1 && skinColor.g < 0.1) {
        finalColor = windowsColor;
    }

    gl_FragColor = vec4(finalColor, alpha);
}