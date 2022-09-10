export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas;
        this.socket = socket;
        this.id = id;
        this.ctx = canvas.getContext('2d');
        this.destroyEvent();
    }

    set fillColor(color) {
        this.ctx.fillStyle = color;
    }
    set strokeColor(color) {
        this.ctx.strokeStyle = color;
    }
    set lineWidth(color) {
        this.ctx.lineWidth = color;
    }

    destroyEvent() {
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
        this.canvas.onmousedown = null;
    }
}