

export function date2str(date) {
    const offset = date.getTimezoneOffset();
    const offsetDate = new Date(date.getTime() - (offset*60*1000));

    const parts = date.toISOString().split('T');
    const stamp = parts[0] + " " + parts[1];
    return stamp.replace( /[a-zA-Z]/g, '' );
}
