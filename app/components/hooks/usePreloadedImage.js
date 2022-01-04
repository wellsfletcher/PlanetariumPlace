import React, { useState, useEffect, useRef } from 'react';

export default function usePreloadedImage(path) {
    const [image, setImage] = useState(new Image());
    useEffect(() => {
        // console.log("image loading");
        // image.src = "../../assets/pixel-countries-mid-res.png";
        image.src = path;
        image.onload = () => {
            //- console.log("image " + path + " loaded"); // uncomment this to view base 64 encoding
            // console.log(image);
        };
        setImage(image);
    }, []);
    return [image, setImage];
}
