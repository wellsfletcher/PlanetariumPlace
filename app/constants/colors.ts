

export const map = {
    "white": "#FFFFFF",
    "lightGray": "#E4E4E4",
    "gray": "#888888",
    "black": "#1B1B1B",
    "pink": "#FFA7D1",
    "red": "#E50000",
    "orange": "#E59500",
    "brown": "#A06A42",
    "yellow": "#E5D900",
    "lightGreen": "#94E044",
    "green": "#02BE01",
    "cyan": "#00D3DD",
    "blue": "#0083C7",
    "indigo": "#0000EA",
    "magenta": "#CF6EE4",
    "purple": "#820080"
};

export const names = [
    "white",
    "lightGray",
    "gray",
    "black",
    "pink",
    "red",
    "orange",
    "brown",
    "yellow",
    "lightGreen",
    "green",
    "cyan",
    "blue",
    "indigo",
    "magenta",
    "purple"
];

/*
export const values = [
    "#FFFFFF",
    "#E4E4E4",
    "#888888",
    "#1B1B1B",
    "#FFA7D1",
    "#E50000",
    "#E59500",
    "#A06A42",
    "#E5D900",
    "#94E044",
    "#02BE01",
    "#00D3DD",
    "#0083C7",
    "#0000EA",
    "#CF6EE4",
    "#820080"
];
*/
export const values = [
    0x1B1B1B,
    0x888888,
    0xE4E4E4,
    0xFFFFFF,
    0xFFA7D1,
    0xE50000,
    0xE59500,
    0xA06A42,
    0xE5D900,
    0x94E044,
    0x02BE01,
    0x00D3DD,
    0x0083C7,
    0x0000EA,
    0xCF6EE4,
    0x820080
];

// TODO: make this get generated dynamically
export const inverseValues = {
    0x1B1B1B: 0,
    0x888888: 1,
    0xE4E4E4: 2,
    0xFFFFFF: 3,
    0xFFA7D1: 4,
    0xE50000: 5,
    0xE59500: 6,
    0xA06A42: 7,
    0xE5D900: 8,
    0x94E044: 9,
    0x02BE01: 10,
    0x00D3DD: 11,
    0x0083C7: 12,
    0x0000EA: 13,
    0xCF6EE4: 14,
    0x820080: 15
};

// export function hexcolor2colorcode(hex: number): number {
//     // TODO: make this O(1)
//     var result = 0;
//     for (var k = 0; k < values.length; k++) {
//         var currentHex = values[k];
//         if (currentHex == hex) {
//             result = k;
//         }
//     }
//     // return 5;
//     return result;
// }

export function hexcolor2colorcode(hex: number): number {
    return inverseValues[hex];
}

export function colorcode2hexcolor(code: number): number {
    return values[code];
}
