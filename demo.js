
const canvasEffects = [ new WaterEffect(), new LBMEffect()];

class AutumnChallenge {

    constructor() {
      this.renderer = null;
      this.frame = 0;
      this.currentEffect = null;
      this.effectIndex = -1;
    }
    
    updatePage(pageOptions) {
      document.getElementById("title1").style.color = pageOptions.textColor;  
      document.getElementById("title2").style.color = pageOptions.textColor.substring(0, 7) + "FF";        
      document.getElementById("message").style.color = pageOptions.messageColor;    
      document.getElementById("message").innerHTML = pageOptions.messageText;
      document.getElementById("changeEffectButton").style.background = pageOptions.buttonColor;
    }

    nextEffect = () => {

      if(this.currentEffect) {
        this.currentEffect.release();
      }
    
      this.effectIndex = (this.effectIndex + 1) % canvasEffects.length;
    
      this.currentEffect = canvasEffects[this.effectIndex];
      this.currentEffect.init();
    
      const canvas = this.renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
    
      this.currentEffect.setSize(width, height);
      this.updatePage(this.currentEffect.pageOptions);
    
      this.frame = 0;
    }
    
    canvasSetup() {
      this.renderer = new THREE.WebGLRenderer();
      document.body.appendChild(this.renderer.domElement);  
    }

    onClick = (event) => {
      this.currentEffect.onClick(event.pageX, event.pageY);
    }

    mouseSetup() {
      document.onmousemove = (event) => {
          this.currentEffect.mouse = {x:event.pageX, y: event.pageY};      
      }
    
      document.addEventListener("click", this.onClick);
    
    }

    resizeRendererToDisplaySize() {
      const canvas = this.renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
  
      if (needResize) {
        this.renderer.setSize(width, height, false);
        this.currentEffect.setSize(width, height);
        this.frame = 0;
      }
      return needResize;
    }
  
    render = (time) => {
  
      this.resizeRendererToDisplaySize();
  
      this.currentEffect.update(time*0.001, this.frame);
      this.currentEffect.render(this.renderer);
      
      this.frame++;
  
      requestAnimationFrame(this.render);
    }

    run() {

      this.canvasSetup();
      this.nextEffect();
      this.mouseSetup();
      this.buttonSetup();
      
      requestAnimationFrame(this.render);
    }

    buttonSetup() {  
      const changeEffectButton = document.getElementById("changeEffectButton");
      changeEffectButton.onclick = () => { this.nextEffect(); };
    }
}

const demo = new AutumnChallenge();
demo.run();

/*
therascience : complements alimentaires, formations webinars
formations en VR au pro de la santé
300 personnes

remplacer un événement en présentiel par un événement VR
virbela
*/