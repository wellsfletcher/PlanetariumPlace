import { useRef, useEffect } from 'react';


const useCanvas = (draw, options={}) => {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      // console.log("rendered");
      // uncommenting this will enable animation and cause it to constantly get rerendered
      // animationFrameId = window.requestAnimationFrame(render);
    }
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};

export default useCanvas;
