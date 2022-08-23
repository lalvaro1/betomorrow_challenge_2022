

var renderer = null;


const changeEffectButton = document.getElementById("changeEffectButton");

changeEffectButton.addEventListener ("click", function() {
  nextEffect();
});

var frame = 0;
var currentEffect = null;
const canvasEffects = [ new WaterEffect(), new LBMEffect()];
var effectIndex = -1;

function nextEffect() {

  if(currentEffect) {
    currentEffect.release();
  }

  effectIndex = (effectIndex + 1) % canvasEffects.length;

  currentEffect = canvasEffects[effectIndex];
  currentEffect.init();

  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  currentEffect.setSize(width, height);

  document.getElementById("title").style.color = currentEffect.textColor;  
  document.getElementById("message").style.color = currentEffect.textColor;    
  document.getElementById("message").innerHTML = currentEffect.message;

  frame = 0;
}

function main() {

  renderer = new THREE.WebGLRenderer();
  document.body.appendChild( renderer.domElement );  

  nextEffect();

  document.onmousemove = handleMouseMove;
  
  function handleMouseMove(event) {
      event = event || window.event; 

      currentEffect.mouse.x = event.pageX;
      currentEffect.mouse.y = event.pageY;      
  }

  function onClick(event) {
    currentEffect.onClick(event.pageX, event.pageY);
  }

  document.addEventListener("click", onClick);

  
   
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
      currentEffect.setSize(width, height);
      frame = 0;
    }
    return needResize;
  }

  function render(time) {

    resizeRendererToDisplaySize(renderer);

    currentEffect.update(time*0.001, frame);
    currentEffect.render(renderer);
    
    frame++;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}



main();
