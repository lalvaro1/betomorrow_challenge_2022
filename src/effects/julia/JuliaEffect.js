class JuliaEffect extends CanvasDemoEffect {
    constructor() {

        super();

        this.pageOptions.messageText = "";
        this.pageOptions.textColor = "#FFFFFFAA";   
        this.pageOptions.buttonColor = "#FF0000AA";                

        this.uniforms = {};
        this.scene = null;
        this.camera = null;
        this.material = null;
    }

    init() {

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
        this.scene  = new THREE.Scene();
        
        this.uniforms = {
          iTime: { value: 0 },
          iResolution:  { value: new THREE.Vector3() },
          iMouse:  { value: new THREE.Vector4(0,0,0,0) },          
        };
        
        this.material = new THREE.ShaderMaterial({
          fragmentShader : julia_fragmentShader,
          uniforms : this.uniforms,
          glslVersion: THREE.GLSL3, 
        });

        const plane = new THREE.PlaneGeometry(2, 2);
        this.scene.add(new THREE.Mesh(plane, this.material));

        console.log("INIT : "+this.mouse.x+" "+this.mouse.y+" => "+this.uniforms.iMouse.value.x+" "+this.uniforms.iMouse.value.y);        
    }

    setSize(w, h) {
        this.uniforms.iResolution.value.set(w, h, 1);
    }

    update(time, frame) {
        this.uniforms.iTime.value = time;
        const height = this.uniforms.iResolution.value.y;
        this.uniforms.iMouse.value = new THREE.Vector4(this.mouse.x, height-this.mouse.y, 1, 1);        
        console.log("UPDATE : "+this.mouse.x+" "+this.mouse.y+" => "+this.uniforms.iMouse.value.x+" "+this.uniforms.iMouse.value.y);        
    }

    render(renderer) {

        console.log("RENDER : "+this.mouse.x+" "+this.mouse.y+" => "+this.uniforms.iMouse.value.x+" "+this.uniforms.iMouse.value.y);

        renderer.setRenderTarget(null);
        renderer.render(this.scene, this.camera); 
    }

    release() {
        
    }

    onClick(x, y) {
    }
}  
  
