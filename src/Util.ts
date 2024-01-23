export function unixNowMs() {
    return new Date().getTime();
}

export function unixNow() {
    return Math.floor(unixNowMs() / 1000);
}

export function unwrap<T>(value?: T) {
    if (!value) {
        throw new Error("Missing value");
    }
    return value;
}
