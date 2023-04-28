export function unixNowMs() {
    return new Date().getTime();
}

export function unwrap<T>(value?: T) {
    if (!value) {
        throw new Error("Missing value");
    }
    return value;
}