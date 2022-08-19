const common_fragmentShader = `
#define CENTER 0
#define RIGHT 1
#define TOPRIGHT 2
#define TOP 3
#define TOPLEFT 4
#define LEFT 5
#define BOTLEFT 6
#define BOTTOM 7
#define BOTRIGHT 8

const vec2 velocities[] = vec2[] (vec2(0., 0.), vec2(1., 0.), vec2(1., 1.), vec2(0., 1.), vec2(-1., 1.), vec2(-1., 0.), vec2(-1., -1.), vec2(0., -1.), vec2(1., -1.));
const float weight[]    = float[] (4./9., 1./9., 1./36., 1./9., 1./36., 1./9., 1./36., 1./9., 1./36.); 

struct Cell {
    float velocities[9];
};

Cell unpack(vec4 rgba) {

    Cell cell;

    cell.velocities[CENTER]   = mod(rgba.a, 1000.);
    cell.velocities[RIGHT]    = floor(rgba.a*0.001);    
    cell.velocities[TOPRIGHT] = mod(rgba.r, 1000.);
    cell.velocities[TOP]      = floor(rgba.r*0.001);    
    cell.velocities[TOPLEFT]  = mod(rgba.g, 1000.);
    cell.velocities[LEFT]     = floor(rgba.g*0.001);    
    cell.velocities[BOTLEFT]  = mod(rgba.b, 1000.);
    cell.velocities[BOTTOM]   = mod(floor(rgba.b*0.001), 1000.);
    cell.velocities[BOTRIGHT] = floor(rgba.b*0.000001);
    
    return cell;
}

vec4 pack(Cell cell) {
    vec4 rgba;
    
    rgba.a = floor(min(999.99, cell.velocities[CENTER]))  + floor(min(999.99, cell.velocities[RIGHT]))  * 1000.;
    rgba.r = floor(min(999.99, cell.velocities[TOPRIGHT]))+ floor(min(999.99, cell.velocities[TOP]))    * 1000.;
    rgba.g = floor(min(999.99, cell.velocities[TOPLEFT])) + floor(min(999.99, cell.velocities[LEFT]))   * 1000.;
    rgba.b = floor(min(999.99, cell.velocities[BOTLEFT])) + floor(min(999.99, cell.velocities[BOTTOM])) * 1000. + floor(min(999.99, cell.velocities[BOTRIGHT]))*1000000.;    
    
    return rgba;
}

`;
