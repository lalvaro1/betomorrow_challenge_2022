///////////////////
// Stream Layer
///////////////////
const stream_fragmentShader = common_fragmentShader + `

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D layer2;

out vec4 fragColor;

// Stream Layer

int symdir(int dir) {
    return (dir == CENTER) ? CENTER : 1 + (dir + 3) % 8;
}

float getVelocity(ivec2 cellCoords, ivec2 neighbourRelative, int direction) {

    int width  = int(iResolution.x);
    int height = int(iResolution.y);
    
    ivec2 neighbourCoords = cellCoords + neighbourRelative;
    
    bool top_border    = neighbourCoords.y==0;
    bool bottom_border = neighbourCoords.y>=height-1;    
    bool left_border   = neighbourCoords.x==0;
    bool right_border  = neighbourCoords.x>=width-1;    

    bool border = top_border||bottom_border||left_border||right_border;

    if(!border) {
       return unpack(texelFetch(layer2, neighbourCoords, 0)).velocities[direction];
    }
    else {
    
        bool diagonal = direction==TOPRIGHT||direction==TOPLEFT||direction==BOTRIGHT||direction==BOTLEFT;
    
        if(!diagonal) {
            return unpack(texelFetch(layer2, cellCoords, 0)).velocities[symdir(direction)];
        }

        switch(direction) {
            case TOPRIGHT: 
                if(bottom_border) {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(-2, 0), 0)).velocities[BOTRIGHT];            
                }
                else {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(0, +2), 0)).velocities[TOPLEFT];            
                }

            case TOPLEFT:  
                if(bottom_border) {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(+2, 0), 0)).velocities[BOTLEFT];            
                }
                else {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(0, +2), 0)).velocities[TOPRIGHT];            
                }

            case BOTRIGHT: 
                if(top_border) {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(-2, 0), 0)).velocities[TOPRIGHT];            
                }
                else {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(0, -2), 0)).velocities[BOTLEFT];            
                }

            case BOTLEFT:  
                if(bottom_border) {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(+2, 0), 0)).velocities[TOPLEFT];            
                }
                else {
                    return unpack(texelFetch(layer2, cellCoords+ivec2(0, -2), 0)).velocities[BOTRIGHT];            
                }
         }
    }
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {

    ivec2 cellCoords = ivec2(fragCoord);
    int width  = int(iResolution.x);
    int height = int(iResolution.y);
   
    bool top_border    = cellCoords.y==0;
    bool bottom_border = cellCoords.y>=height-1;    
    bool left_border   = cellCoords.x==0;
    bool right_border  = cellCoords.x>=width-1;    

    bool border = top_border||bottom_border||left_border||right_border;
 
    Cell cur;

    if(border) {
        for(int i=0; i<9; i++) {
            cur.velocities[i] = 0.;
        }
    }
    else {
        // stream    
        for(int i=0; i<9; i++) {
            cur.velocities[i] = getVelocity(cellCoords, ivec2(velocities[symdir(i)]), i);
        }
    }

    fragColor = pack(cur); 
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}

`;