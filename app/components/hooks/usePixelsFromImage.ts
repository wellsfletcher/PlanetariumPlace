import React, { useEffect, useRef, useState } from 'react';

// interface UsePixelsFromImageResult {
//     pixels: Uint8ClampedArray | null;
//     canvasRef: React.RefObject<HTMLCanvasElement>;
// }

const usePixelsFromImage = (imageUrl: string): [Uint8ClampedArray, React.RefObject<HTMLCanvasElement>] => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [pixels, setPixels] = useState<Uint8ClampedArray | null>(null);
    const [pixels, setPixels] = useState<Uint8ClampedArray>(new Uint8ClampedArray(0));

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Enable CORS if the image is from a different origin
        img.src = imageUrl;

        img.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    setPixels(imageData.data);
                }
            }
        };

        img.onerror = () => {
            console.error('Failed to load image');
        };
    }, [imageUrl]);

    return [pixels, canvasRef];
};

export default usePixelsFromImage;