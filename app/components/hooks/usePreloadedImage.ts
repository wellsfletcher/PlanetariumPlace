import React, { useState, useEffect, useRef } from 'react';
import useImage from "./useImage";

export default function usePreloadedImage(path: string): [HTMLImageElement, any] {
    // const [image, setImage] = useState<HTMLImageElement>(new Image());
    // useEffect(() => {
    //     // image.src = "../../assets/pixel-countries-mid-res.png";
    //     image.src = path;
    //     image.onload = () => {
    //         //- console.log("image " + path + " loaded"); // uncomment this to view base 64 encoding
    //         // console.log(image);
    //         setImage(image);
    //     };
    //     //-- setImage(image);
    // }, []); // TODO: should probably update this to change when the "path" parameter changes // nah nvm I shouldn't
    // // }, [path]);
    // return [image, setImage];
    return [useImage(path), (value) => {}];
}
