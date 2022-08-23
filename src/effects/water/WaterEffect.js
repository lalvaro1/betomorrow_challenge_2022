class WaterEffect extends CanvasDemoEffect {
    constructor() {

        super();

        super.message = "I'm clickable.";
        super.textColor = "#444444AA";        

        this.NB_WAVES = 10;  
        this.WAVE_DURATION = 3.;

        this.waves = [];
        this.uniforms = {};
        this.scene = null;
        this.camera = null;
        this.material = null;
    }

    init() {

        for(var i=0; i<this.NB_WAVES; i++) {
            this.waves[i] = new THREE.Vector3(0,0,-9999);
        }

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
        this.scene  = new THREE.Scene();
        
        this.uniforms = {
          iTime: { value: 0 },
          iResolution:  { value: new THREE.Vector3() },
          waves : { type: "v3v", value: this.waves }, 
        };
        
        this.material = new THREE.ShaderMaterial({
          fragmentShader : water_fragmentShader,
          uniforms : this.uniforms,
          glslVersion: THREE.GLSL3, 
        });

        const plane = new THREE.PlaneGeometry(2, 2);
        this.scene.add(new THREE.Mesh(plane, this.material));
    }

    setSize(w, h) {
        this.uniforms.iResolution.value.set(w, h, 1);
    }

    noWaveOnScreenSince(since) {
        for(var i=0; i<this.NB_WAVES; i++) {
            var wave = this.waves[i];
            if(wave.z + this.WAVE_DURATION > since) {
                return false;
            }
        }
        return true;
    }
    
    update(time, frame) {
        
        const width  = this.uniforms.iResolution.value.x;
        const height = this.uniforms.iResolution.value.y;        

        if(this.noWaveOnScreenSince(time - 3)) {
            this.createWave(width * (0.5 + (Math.random()*0.5-0.25)), height * (0.5 + (Math.random()*0.5-0.25)));
        }
        
        this.uniforms.iTime.value = time;
    }

    render(renderer) {
        renderer.setRenderTarget(null);
        renderer.render(this.scene, this.camera); 
    }

    release() {
        
    }

    createWave(x, y) {
  
        const time = this.uniforms.iTime.value;
  
        for(var i=0; i<this.NB_WAVES; i++) {
            var wave = this.waves[i];

            if(wave.z + this.WAVE_DURATION < time) {
                wave.x = x
                wave.y = y;
                wave.z = time;
                break;
            }
    
        }
    }
  
    onClick(x, y) {
        this.createWave(x, y);
    }
}  
  
