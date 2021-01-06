import { int2rgba, vector2index } from '../utils/general';


export function drawPixel(ctx, x, y) {
    var r = 255;
    var g = 100;
    var b = 100;
    var a = 255;
    var id = ctx.createImageData(1,1); // only do this once per page
    var d  = id.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;
    ctx.putImageData(id, x, y);
};

export function drawPixelBuffer(ctx, pixels, bufferWidth, hasAlpha=false) {
    var width = bufferWidth;
    var height = pixels.length / width; // floor?

    // var bufferLength = width * height * 4;
    var bufferLength = pixels.length * 4;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const buffer = new Uint8ClampedArray(arrayBuffer);
    // console.log("buffer.length = " + buffer.length);

    var k = 0;
    for (var pixel of pixels) {
        const i = k * 4;
        /*
        var r = 255;
        var g = 100;
        var b = 100;
        var a = 255 * pixel;
        // console.log("pixel = " + pixel);
        */
        var {r, g, b, a} = int2rgba(pixel);
        if (!hasAlpha) a = 255;

        buffer[i + 0]   = r; // red
        buffer[i + 1]   = g; // green
        buffer[i + 2]   = b; // blue
        buffer[i + 3]   = a; // alpha
        k++;
    }

    const imageData = new ImageData(buffer, width, height);
    ctx.putImageData(imageData, 0, 0);
    return imageData;
};

export function drawUint8ClampedArray(ctx, buffer, width, height) {
    const imageData = new ImageData(buffer, width, height);
    ctx.putImageData(imageData, 0, 0);
    return imageData;
};

export function drawImageData(ctx, imageData) {
    ctx.putImageData(imageData, 0, 0);
};


/*
export var drawPixel = (ctx, x, y) => {
    var r = 255;
    var g = 100;
    var b = 100;
    var a = 255;
    var id = ctx.createImageData(1,1); // only do this once per page
    var d  = id.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;
    ctx.putImageData(id, x, y);
};

export const drawPixelBuffer = (ctx, pixels, bufferWidth, hasAlpha=false) => {
    var width = bufferWidth;
    var height = pixels.length / width; // floor?

    // var bufferLength = width * height * 4;
    var bufferLength = pixels.length * 4;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const buffer = new Uint8ClampedArray(arrayBuffer);
    // console.log("buffer.length = " + buffer.length);

    var k = 0;
    for (var pixel of pixels) {
        const i = k * 4;
        var {r, g, b, a} = int2rgba(pixel);
        if (!hasAlpha) a = 255;

        buffer[i + 0]   = r; // red
        buffer[i + 1]   = g; // green
        buffer[i + 2]   = b; // blue
        buffer[i + 3]   = a; // alpha
        k++;
    }

    const imageData = new ImageData(buffer, width, height);
    ctx.putImageData(imageData, 0, 0);
    return imageData;
};

export const drawImageData = (ctx, imageData) => {
    ctx.putImageData(imageData, 0, 0);
};
*/
