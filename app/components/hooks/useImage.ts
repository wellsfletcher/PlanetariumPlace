import { useState, useEffect } from 'react';

function useImage(imagePath: string): HTMLImageElement | null {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!imagePath) {
            setImage(null);
            return;
        }

        const img = new Image();
        img.src = imagePath;

        const handleLoad = () => {
            setImage(img);
        };

        img.onload = handleLoad;

        return () => {
            img.onload = null; // Cleanup to avoid memory leaks
        };
    }, [imagePath]);

    return image;
}

export default useImage;
