import Tool from "./Tool";

export default class Brush extends Tool {
    constructor(props, socket, id) {
        super(props, socket, id);
        this.listen();
    }
    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    }
    mouseUpHandler() {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }))
    }
    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    color: this.ctx.fillStyle,
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                }
            }));
        }
    }

    static draw(ctx, x, y, color) {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.strokeStyle = color;
    }
}