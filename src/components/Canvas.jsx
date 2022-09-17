import React, {useEffect, useRef, useState} from 'react';
import "../styles/canvas.scss"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import  {Modal, Button} from "react-bootstrap";
import {useParams} from "react-router-dom"
import Rect from "../tools/Rect";
import axios from 'axios'
import Eraser from "../tools/Eraser";

const Canvas = observer(() => {
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()

    useEffect(() => {
        let ctx = canvasRef.current.getContext('2d')

        canvasState.setCanvas(canvasRef.current)
        // axios.get(`http://localhost:5001/image?id=${params.id}`)
        // axios.get(`https://scidraw-server.herokuapp.com/image?id=${params.id}`)
        axios.get(`https://scidraw.ru/image?id=${params.id}`)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                };
            });
    }, []);

    useEffect(() => {
        if (canvasState.username) {
            // const socket = new WebSocket(`ws://localhost:5001/`);
            // const socket = new WebSocket('ws://scidraw-server.herokuapp.com');
            const socket = new WebSocket('ws://scidraw.ru/ws');
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                console.log('Подключение установлено')
                socket.send(JSON.stringify({
                    id:params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case "connection":
                        console.log(`пользователь ${msg.username} присоединился`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color);
                break;
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
                break;
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y, figure.color);
                break;
            case "finish":
                ctx.beginPath();
                break;
        }
    };

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
        // axios.post(`http://localhost:5001/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
        // axios.post(`http://scidraw-server.herokuapp.com/image?id=${params.id}`, {
        axios.post(`http://scidraw.ru/image?id=${params.id}`, {
            img: canvasRef.current.toDataURL(),
        }).then(response => console.log(response.data));
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    };

    const moveCursorMarker = (event) => {
        const pointerElem = document.getElementById('pointer');
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let crd = canvasRef.current.getBoundingClientRect();
        let activePointer = crd.left <= mouseX && mouseX <= crd.right && crd.top <= mouseY && mouseY <= crd.bottom;

        requestAnimationFrame(function movePointer() {
            if (activePointer) {
                pointerElem.classList.remove('box-pointer-hidden');
                pointerElem.style.left = Math.floor(mouseX) + 10 + 'px';
                pointerElem.style.top = Math.floor(mouseY) + 10 + 'px';
            } else {
                pointerElem.classList.add('box-pointer-hidden');
            }
        });
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header >
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{position: 'absolute'}} id='pointer'>{canvasState.username}</div>
            <canvas id='canvas' onMouseMove={(e) => moveCursorMarker(e)} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={2000} height={1400}/>
        </div>
    );
});

export default Canvas;