

/**
Converts the given x, y coordinate to an array buffer index.
*/
export function xy2index(x, y, width) {
    return (y * width) + x; // = index
}
// x = (index) - (y * width)
// y = (index - x) / width
// height = bufferLength / width

export function coordinate2index(x, y, width) {
    return xy2index(x, y, width);
}

/**
Converts the given vector coordinate to an array buffer index,
where a vector is represented by {x,y}
*/
export function vector2index({x, y}, width) {
    return xy2index(x, y, width);
}

/**
Converts the array buffer index to an x, y coordinate vector
*/
export function index2vector(index, width) {
    return {};
}

/**
Calculates the true mathmatical mod.
*/
export function mod(n, m) {
  return ((n % m) + m) % m;
}

export function int2hexcolor(num) { // doesn't allow transperancy as of now
    return "#" + this.decimal2hex(num, 6);
}

export function decimal2hex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

export function hexcolor2int(hex) { // doesn't allow transperancy as of now
    // if () ;
    hex = hex.slice(1);
    return parseInt(hex, 16);
}

export function int2rgba(num) {
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

export function int2rgb(num) {
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
