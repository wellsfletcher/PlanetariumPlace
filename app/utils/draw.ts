import { int2rgba, vector2index } from './general';


export function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number) {
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

export function drawPixelBuffer(ctx: CanvasRenderingContext2D, pixels: any, bufferWidth: number, hasAlpha: boolean = false): ImageData {
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

export function drawPixelRgbaBuffer(ctx: CanvasRenderingContext2D, pixels: any, bufferWidth: number): ImageData {
    var bufferHeight = (pixels.length / 4) / bufferWidth;
    return drawUint8ClampedArray(ctx, pixels, bufferWidth, bufferHeight);
};

export function paintCanvasBlack(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

/**
Makes async call to load the image
*/
// export function fillCanvasWithImagePath(ctx: any, path: string, canvasWidth: number, canvasHeight: number) {
//     // TODO: figure out why this passing "this" as a parameter any why I can't set the type of ctx without causing error
//     // TODO: does this function even get used? I think it doesn't?
//     var image = new Image();
//     image.src = path;
//     image.onload = function() {
//         var pattern = ctx.createPattern(this, "repeat");
//         ctx.fillStyle = pattern;
//         ctx.fillRect(0, 0, canvasWidth, canvasHeight);
//         ctx.fill();
//     };
// };

/**
Requires image to already be preloaded
*/
export function fillCanvasWithImage(ctx: CanvasRenderingContext2D, image: CanvasImageSource, canvasWidth: number, canvasHeight: number) {
    var pattern = ctx.createPattern(image, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fill();
};

/*
export function fillCanvasWithImage(ctx, image, canvasWidth, canvasHeight) {
    image.onload = function() {
        var pattern = ctx.createPattern(image, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fill();
    }
};
*/

export function drawUint8ClampedArray(ctx: CanvasRenderingContext2D, buffer: any, width: number, height: number): ImageData {
    const imageData = new ImageData(buffer, width, height);
    ctx.putImageData(imageData, 0, 0);
    return imageData;
};

export function drawImageData(ctx: CanvasRenderingContext2D, imageData: ImageData) {
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
