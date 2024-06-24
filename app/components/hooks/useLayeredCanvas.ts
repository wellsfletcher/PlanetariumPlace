import { useRef, useEffect } from 'react';

interface CanvasLayerProps {
    drawFunction: (ctx: CanvasRenderingContext2D, frameCount: number) => void,
    enabled: boolean
}

const useLayeredCanvas = (layers: CanvasLayerProps[]) => {
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>(layers.map(() => null));
    const baseCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const baseCanvas: HTMLCanvasElement = baseCanvasRef.current!;
        const baseContext = baseCanvas.getContext('2d');
        const frameCount = 0;

        const renderLayer = (layer: CanvasLayerProps, layerIndex: number) => {
            const canvas = canvasRefs.current[layerIndex];
            if (canvas && layer.enabled) {
                const context = canvas.getContext('2d');
                layer.drawFunction(context, frameCount);
                baseContext.drawImage(canvas, 0, 0);
            }
        };

        const render = () => {
            baseContext.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
            layers.forEach(renderLayer);
        };
        render();
    }, [layers]);

    return { canvasRefs, baseCanvasRef };
};

export default useLayeredCanvas;
