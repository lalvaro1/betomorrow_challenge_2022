const main_fragmentShader = common_fragmentShader + `

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D layer2;

out vec4 fragColor;

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 cellData = texelFetch(layer2, ivec2(fragCoord), 0);
    Cell cell = unpack(cellData);
    
    float mass = 0.;
    
    for(int i=0; i<9; i++) {
        mass = max(mass, cell.velocities[i]);
    }

    float r = smoothstep(80., 250., mass);
    float g = smoothstep(100., 400., mass);
    float b = smoothstep(300., 400., mass);    
    
    fragColor = vec4(r, g, b, 1.);

    //fragColor = vec4(0,1,0,1);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
`;