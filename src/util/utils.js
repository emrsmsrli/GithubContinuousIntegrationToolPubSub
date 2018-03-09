// @flow

export function error(desc: string, e: ?any): Error {
    let log = desc + ': ';
    if (typeof e === 'object')
        log += JSON.stringify(e);
    else if (e !== undefined) log += e;
    console.log(log);
    return new Error(log);
}