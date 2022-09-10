import {makeAutoObservable} from 'mobx';

class ToolState {
    tool = null;

    constructor() {
        makeAutoObservable(this);
    }

    setTool(tool) {
        this.tool = tool;
    }
    setFillColor(color) {
        this.tool.fillColor = color;
    }
    setStrokeColor(color) {
        this.tool.strokeStyle = color;
    }
    setLineWidth(color) {
        this.tool.lineWidth = color;
    }
}

export default new ToolState();