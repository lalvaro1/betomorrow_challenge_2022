function main() {

  var iFrame = 0;

  const renderer = new THREE.WebGLRenderer();
  document.body.appendChild( renderer.domElement );  

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const main_scene = new THREE.Scene();
  const lay1_scene = new THREE.Scene();
  const lay2_scene = new THREE.Scene();  

  const renderTarget_options = { format : THREE.RGBAFormat, type : THREE.FloatType, depthBuffer : false }

  const renderTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTarget_options);
  const renderTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTarget_options);

  const main_uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
    layer2 : { value : renderTarget2.texture },
  };
  const main_material = new THREE.ShaderMaterial({
    fragmentShader : main_fragmentShader,
    uniforms : main_uniforms,
    glslVersion: THREE.GLSL3, 
  });
  
  const layer1_uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
    layer2 : { value : renderTarget2.texture },
  };
  const layer1_material = new THREE.ShaderMaterial({
    fragmentShader : stream_fragmentShader,
    uniforms : layer1_uniforms,
    glslVersion: THREE.GLSL3,     
  });

  const layer2_uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
    iMouse:  { value: new THREE.Vector4() },
    layer1 : { value : renderTarget1.texture },
    iFrame : { value : 0 },    
  };
  const layer2_material = new THREE.ShaderMaterial({
    fragmentShader : collide_fragmentShader,
    uniforms : layer2_uniforms,
    glslVersion: THREE.GLSL3,     
  });

  const plane = new THREE.PlaneGeometry(2, 2);

  //main_scene.add(new THREE.Mesh(plane, main_material));
  lay1_scene.add(new THREE.Mesh(plane, layer1_material));
  lay2_scene.add(new THREE.Mesh(plane, layer2_material));
  main_scene.add(new THREE.Mesh(plane, main_material));
  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
      renderTarget1.setSize(width, height, false);
      renderTarget2.setSize(width, height, false);

      main_uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
      layer1_uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
      layer2_uniforms.iResolution.value.set(canvas.width, canvas.height, 1);

      iFrame = 0;
    }
    return needResize;
  }

  function render(time) {

    time *= 0.001; 

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    main_uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    layer1_uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    layer2_uniforms.iResolution.value.set(canvas.width, canvas.height, 1);

    main_uniforms.iTime.value   = time;
    layer1_uniforms.iTime.value = time;
    layer2_uniforms.iTime.value = time;        

    layer2_uniforms.iFrame.value = iFrame++;    

    layer2_uniforms.iMouse.value = new THREE.Vector4(mousePos.x, canvas.height-mousePos.y, 1, 1);
if(iFrame<200000) {
    renderer.setRenderTarget(renderTarget2);
    renderer.render(lay2_scene, camera);

    renderer.setRenderTarget(renderTarget1);
    renderer.render(lay1_scene, camera);
}
    renderer.setRenderTarget(null);
    renderer.render(main_scene, camera); 
    
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

var mousePos = { x: 0, y: 0};
document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
    event = event || window.event; 
    mousePos = { x: event.pageX, y: event.pageY };
}


main();
