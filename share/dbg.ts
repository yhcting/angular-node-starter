export function dbg(enable: boolean) {
    if (enable) {
        return {
            p: console.log,
            x: (o: Function) => o()
        };
    } else {
        return {
            p: (...arg: any[]) => {},
            x: (o: Function) => {}
        };
    }
}
