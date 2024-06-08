import { useRef, useEffect } from 'react';


const useCanvas = (draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId; // TODO: is this just always undefined? investigate this

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      // console.log("drawn");
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
