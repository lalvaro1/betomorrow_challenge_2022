class CanvasDemoEffect {

    constructor() {

        this.mouse = { x: -9999, y: -9999 };

        this.pageOptions = {
            titleColor : "#888888",
            messageColor : "No message.",
            messageText : "No message.",
            buttonColor : "#6930edc0"
        }
    }

    init()              {}
    setSize(w, h)       {}
    update(time, frame) {}
    render(renderer)    {}
    release()           {}
    onClick(x, y)       {}
}  
  
