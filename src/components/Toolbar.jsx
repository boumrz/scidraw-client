import React from 'react';
import '../styles/toolbar.scss';
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";

const Toolbar = () => {
    const changeColor = (e) => {
        toolState.setStrokeColor(e.target.value);
        toolState.setFillColor(e.target.value);
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = canvasState.sessionId + '.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className='toolbar'>
            <div className='paint-bar'>
                <button className='toolbar__btn brush' onClick={() => toolState.setTool(new Brush(canvasState.canvas))}></button>
                <button
                    className='toolbar__btn rect'
                    onClick={() => toolState.setTool(
                        new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId)
                    )}
                ></button>
                <button className='toolbar__btn circle'></button>
                <button className='toolbar__btn eraser' onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}></button>
                <button className='toolbar__btn line'></button>
                <input onChange={e => changeColor(e)} type='color' style={{marginLeft: 10 }} />
            </div>
            <div className='option-bar'>
                <button className='toolbar__btn undo' onClick={() => canvasState.undo()}></button>
                <button className='toolbar__btn redo' onClick={() => canvasState.redo()}></button>
                <button className='toolbar__btn save' onClick={() => download()}></button>
            </div>
        </div>
    );
};

export default Toolbar;