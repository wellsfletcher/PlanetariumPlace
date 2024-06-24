import React from 'react';

interface HiddenCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const HiddenCanvas: React.FC<HiddenCanvasProps> = ({ canvasRef }) => {
    return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default HiddenCanvas;