

export function date2str(date) {
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
export function str2date(str) {
    const parts = str.split(' ');
    const stamp = parts[0] + "T" + parts[1] + "Z";
    return new Date(stamp);
}
