import React from 'react';
import { useRef, useEffect } from 'react';

import useCanvas from './useCanvas';

/*
const Canvas = props => {
    // const { draw, ...rest } = props;
    const { draw, setCanvasProps, ...rest } = props;
    const canvasRef = useRef(null);

    // var drawFromProps = props.draw; // is undefined for some reason
    // console.log("draw = ");
    // console.log(drawFromProps);
    // const canvas2 = canvasRef.current;


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let frameCount = 0;
        let animationFrameId;

        // context.canvas.width = 300;
        // context.canvas.height = 300;
        // console.log("canvas.width = " + canvas.width);

        const canvasProps = {
            getBoundingClientRect: canvas.getBoundingClientRect
        };
        // setCanvasProps(canvasProps);

        /--
        const render = () => {
            frameCount++;
            draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        }
        render()
        --/
        draw(context, frameCount);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [draw]);

    const style = {
        imageRendering: "pixelated"
    };

    return <canvas ref={canvasRef} style={style} {...rest}/>;
}
*/

const Canvas = props => {

  const { draw, options, ...rest } = props;
  const { context, ...moreConfig } = options;
  const canvasRef = useCanvas(draw, {context}); // put this fun stuff into the board logic

  return <canvas ref={canvasRef} {...rest} />;
}

/*
const Canvas = props => {

  const canvasRef = useRef(null)

  const draw = ctx => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20, 0, 2*Math.PI)
    ctx.fill()
  }

  useEffect(() => {

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    //Our draw come here
    draw(context)
  }, [draw])

  return <canvas ref={canvasRef} {...props}/>;
};
*/

export default Canvas;
