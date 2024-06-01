

export function date2str(date: Date): string {
    const offset = date.getTimezoneOffset();
    const offsetDate = new Date(date.getTime() - (offset*60*1000));

    const parts = date.toISOString().split('T');
    const stamp = parts[0] + " " + parts[1];
    return stamp.replace( /[a-zA-Z]/g, '' );
}

/**
Takes a very specific string format as its argument.
YYYY-MM-DD HH:MM:SS.mmm
*/
export function str2date(str: string): Date {
    const parts = str.split(' ');
    const stamp = parts[0] + "T" + parts[1] + "Z";
    return new Date(stamp);
}

/**
 * Get the current time remaining from the given timestamp
 * @param {number} stopTime A timestamp in ms, should be in the future
 * @returns {number} Time in ms
 */
export function getRemaining(stopTime: number): number {
    var now = Date.now();
    return Math.max(0, stopTime - now);
}

/**
 * Adds time in milliseconds to the given date.
*/
export function addMillis(date: Date, millis: number): Date {
    // TODO: why is there an extra plus sign here?
    return new Date(+date.getTime() + millis);
}
