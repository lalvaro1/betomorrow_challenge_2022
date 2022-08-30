const julia_fragmentShader = `

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D layer2;
uniform vec4 iMouse;


const int ITER = 200;

vec3 stepColor(float f) {
    if(f == 0.0) return vec3(250,0,0)/256.0;
 	if(f<0.2) 	 return vec3(255,255,0)/256.0;
 	if(f<0.3) 	 return vec3(0,255,0)/256.0*0.8;    
 	if(f<0.4) 	 return vec3(0,0,255)/256.0;
 	if(f<0.5) 	 return vec3(255,255,255)/256.0;
 	if(f<0.6) 	 return vec3(0,0,255)/256.0;
 	if(f<0.7) 	 return vec3(255,255,0)/256.0;
 	if(f<0.8) 	 return vec3(255,0,0)/256.0;
 	if(f<0.9) 	 return vec3(255,255,0)/256.0;
    if(f<1.0)    return vec3(255)/256.0;
    return vec3(0,0,255)/256.0;
}

vec3 color(float k) {
    
    float i1  = floor(k*10.0)*0.1;
    float i2  = ceil(k*10.0)*0.1;    

    vec3 c1 = stepColor(i1);
    vec3 c2 = stepColor(i2);    
    
	float ratio = (k - i1)/0.1;
    
    return mix(c1, c2, pow(ratio,1.5));
}
    
vec4 run(in vec2 fragCoord) {
    
	vec2 uv = fragCoord.xy / iResolution.xy - vec2(0.5, 0.5);
    uv.x*=iResolution.x/iResolution.y;
    
    float zoom  = pow(cos(iTime/10.0), 2.0)*1.5;
    zoom = 2.;
    
    vec2 offset = vec2(0);//vec2(-0.473535, -0.18895);
    
    uv = uv * zoom + offset;
    
    float t = iTime*0.01;
    //uv *= mat2(vec2(cos(t),sin(t)), vec2(-sin(t),cos(t)));
    
    vec2 z = uv;

    vec2 mouseInfluence = normalize((iMouse.xy - iResolution.xy * 0.5) / iResolution.y) * 0.75 + sin(iTime*0.05)*0.1;
    vec2 c = vec2(0., 0.) + mouseInfluence;
    
    int nbiter = 0;
    
    for(int i=0; i<ITER;i++) {
     
        float _2xy = 2.0*z.x*z.y;
        z.x = z.x*z.x - z.y*z.y;
        z.y = _2xy;
        
        z += c;
        
        if(length(z)>2.0) {
			break;            
        }
        
        nbiter++;
    }
    
    float kcolor = float(nbiter)/float(ITER);
    vec3 res = color(kcolor);
    
	return vec4(res,1.0);
    
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec4 fragColor1 = run(fragCoord + vec2(-0.25, -0.25));
    vec4 fragColor2 = run(fragCoord + vec2(+0.25, -0.25));
    vec4 fragColor3 = run(fragCoord + vec2(-0.25, +0.25));
    vec4 fragColor4 = run(fragCoord + vec2(+0.25, +0.25));
    
    fragColor = (fragColor1 + fragColor2 + fragColor3 + fragColor4) * 0.25;
} 

out vec4 fragColor;

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}

`;
