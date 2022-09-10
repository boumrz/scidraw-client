import Brush from "./Brush";

export default class Eraser extends Brush {
    constructor(props) {
        super(props);
    }

    draw(x, y) {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
}