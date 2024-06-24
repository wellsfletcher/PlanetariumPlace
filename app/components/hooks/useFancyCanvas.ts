import { useRef, useEffect } from 'react';
import useCanvas from "./useCanvas";


// TODO: Rename this hook/file
// TODO: (probably) create an exportable DrawFunction type
const useFancyCanvas = (drawFunctions: ((ctx: CanvasRenderingContext2D, frameCount: number) => void)[]) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    let combinedDrawFunction = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        for (let drawFunction of drawFunctions) {
            drawFunction(ctx, frameCount);
        }
    }

    return useCanvas(combinedDrawFunction);
};

export default useFancyCanvas;
