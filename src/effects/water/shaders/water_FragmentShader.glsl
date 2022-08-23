const water_fragmentShader = `

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D layer2;
uniform vec3[10] waves;

out vec4 fragColor;

const float WAVE_SPEED       = 300.;
const float WAVE_HEIGHT      = 3.0;
const float WAVE_DURATION    = 5.;
const float WAVE_PERIOD      = 0.06;
const float WAVE_ATTENUATION = 0.01;

float f(float dist) {
    float attenuate = 1. / (1. + pow(WAVE_ATTENUATION*dist, 2.0));
    return sin(WAVE_PERIOD*dist) * attenuate * WAVE_HEIGHT;
}

float h(vec2 p) {

    float h = 0.;

    for(int i=0; i<10; i++) {
    
        vec3 wave = waves[i];
        float age = iTime - wave.z;
    
        if(age < WAVE_DURATION) {
    
            vec2 waveOrigin = vec2(wave.x, iResolution.y - wave.y);

            float dt = age;
            float pos = dt * WAVE_SPEED;
            float dist = length(p - waveOrigin);
            float fade = max(0., (WAVE_DURATION*.5-dt)/(WAVE_DURATION*0.5));  

            h += f(dist - pos) * fade;
        }
    }
    
    return h;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy - 0.5;
    uv.x *= iResolution.x / iResolution.y;
    
    uv = fragCoord.xy;

    vec2 eps = vec2(2., 0.);
    float dhx = h(uv + eps.xy) - h(uv - eps.xy);
    float dhy = h(uv + eps.yx) - h(uv - eps.yx);    
    
    vec3 normal = normalize(vec3(dhx, dhy, eps.x*2.));    
    
    vec3 light = normalize(vec3(1.0));
    float diffuse = max(dot(light, normal),-1.);
    
    float diagonalGradient = (1.-fragCoord.y/iResolution.y) * fragCoord.x/iResolution.x;
    vec4 color1 = vec4(1.);
    vec4 color2 = vec4(230./255., 225./255., 243./255., 1.);    
    float bias = 1.;

    vec4 baseColor = mix(color1, color2, pow(diagonalGradient, bias));

    fragColor = vec4(vec3(0.33 + diffuse), 1.) * baseColor;
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
`;