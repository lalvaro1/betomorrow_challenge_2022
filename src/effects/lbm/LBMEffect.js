class LBMEffect extends CanvasDemoEffect {

  constructor() {

    super();

    super.message = "";
    super.textColor = "#FFFFFFAA";       

    this.main_uniforms = {};
    this.layer1_uniforms = null;
    this.layer2_uniforms = null;
    this.main_scene = null;
    this.lay1_scene = null;
    this.lay2_scene = null;
    this.renderTarget1 = null;
    this.renderTarget2 = null;
    this.camera = null;
    this.main_material = null;
    this.layer1_material = null;
    this.layer2_material = null;        
  }


  init() {

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    this.main_scene = new THREE.Scene();
    this.lay1_scene = new THREE.Scene();
    this.lay2_scene = new THREE.Scene();  

    const renderTarget_options = { format : THREE.RGBAFormat, type : THREE.FloatType, depthBuffer : false }

    this.renderTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTarget_options);
    this.renderTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTarget_options);
  
    this.main_uniforms = {
      iTime: { value: 0 },
      iResolution:  { value: new THREE.Vector3() },
      layer2 : { value : this.renderTarget2.texture },
    };
    this.main_material = new THREE.ShaderMaterial({
      fragmentShader : main_fragmentShader,
      uniforms : this.main_uniforms,
      glslVersion: THREE.GLSL3, 
    });
    
    this.layer1_uniforms = {
      iTime: { value: 0 },
      iResolution:  { value: new THREE.Vector3() },
      layer2 : { value : this.renderTarget2.texture },
    };
    this.layer1_material = new THREE.ShaderMaterial({
      fragmentShader : stream_fragmentShader,
      uniforms : this.layer1_uniforms,
      glslVersion: THREE.GLSL3,     
    });
  
    this.layer2_uniforms = {
      iTime: { value: 0 },
      iResolution:  { value: new THREE.Vector3() },
      iMouse:  { value: new THREE.Vector4() },
      layer1 : { value : this.renderTarget1.texture },
      iFrame : { value : 0 },    
    };
    this.layer2_material = new THREE.ShaderMaterial({
      fragmentShader : collide_fragmentShader,
      uniforms : this.layer2_uniforms,
      glslVersion: THREE.GLSL3,     
    });
  
    const plane = new THREE.PlaneGeometry(2, 2);
  
    //main_scene.add(new THREE.Mesh(plane, main_material));
    this.lay1_scene.add(new THREE.Mesh(plane, this.layer1_material));
    this.lay2_scene.add(new THREE.Mesh(plane, this.layer2_material));
    this.main_scene.add(new THREE.Mesh(plane, this.main_material));
   
  }

  setSize(width, height) {
    this.renderTarget1.setSize(width, height, false);
    this.renderTarget2.setSize(width, height, false);

    this.main_uniforms.iResolution.value.set(width, height, 1);
    this.layer1_uniforms.iResolution.value.set(width, height, 1);
    this.layer2_uniforms.iResolution.value.set(width, height, 1);
  }

  update(time, frame)  {

    this.main_uniforms.iTime.value   = time;
    this.layer1_uniforms.iTime.value = time;
    this.layer2_uniforms.iTime.value = time;        
    this.layer2_uniforms.iFrame.value = frame;    

    const height = this.main_uniforms.iResolution.value.y;
    this.layer2_uniforms.iMouse.value = new THREE.Vector4(this.mouse.x, height-this.mouse.y, 1, 1);
  }

  render(renderer)  {
    renderer.setRenderTarget(this.renderTarget2);
    renderer.render(this.lay2_scene, this.camera);

    renderer.setRenderTarget(this.renderTarget1);
    renderer.render(this.lay1_scene, this.camera);

    renderer.setRenderTarget(null);
    renderer.render(this.main_scene, this.camera); 
  }

  release() {

  }

  onClick() {

  }
}

/*
var mousePos = { x: 0, y: 0};
document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
    event = event || window.event; 
    mousePos = { x: event.pageX, y: event.pageY };
}
*/
