

/**
Converts the given x, y coordinate to an array buffer index.
*/
export function xy2index(x: number, y: number, width: number): number {
    return (y * width) + x; // = index
}
// x = (index) - (y * width)
// y = (index - x) / width
// x = index % width
// y = (index - (index % width)) / width
// height = bufferLength / width
// 0 < x < width
// 0 < y < height

export function coordinate2index(x: number, y: number, width: number): number {
    return xy2index(x, y, width);
}

/**
Converts the given vector coordinate to an array buffer index,
where a vector is represented by {x,y}
*/
export function vector2index({x, y}, width: number): number {
    return xy2index(x, y, width);
}

/**
Converts the array buffer index to an x, y coordinate vector
*/
export function index2vector(index: number, width: number): any {
    const x = index % width;
    const y = (index - x) / width;
    return {x: x, y: y};
}

/**
Calculates the true mathmatical mod.
*/
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function int2hexcolor(num: number): string { // doesn't allow transperancy as of now
    return "#" + this.decimal2hex(num, 6);
}

export function decimal2hex(d: number, padding): string {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

export function hexcolor2int(hex: string): number { // doesn't allow transperancy as of now
    // if () ;
    hex = hex.slice(1);
    return parseInt(hex, 16);
}

export function int2rgba(num: number): any {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ( (num & 0xFF000000) >>> 24 ); // / 255;
    return {
        r: r,
        g: g,
        b: b,
        a: a
    };
}

export function int2rgb(num: number): any {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    return {
        r: r,
        g: g,
        b: b,
    };
}

export function rgba2int(rgba: {r: number, g: number, b: number, a: number}): number {
    let { r, g, b, a } = rgba;
    return (r << 24) + (g << 16) + (b << 8) + a;
}

export function rgb2int(rgb: {r: number, g: number, b: number}): number {
    let { r, g, b } = rgb;
    return (r << 16) + (g << 8) + b;
}

export function XOR(a: boolean, b: boolean): boolean {
    return (a && !b) || (!a && b);
}