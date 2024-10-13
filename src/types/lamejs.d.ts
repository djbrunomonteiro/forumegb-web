declare module 'lamejs' {
    class Mp3Encoder {
        constructor(channels: number, sampleRate: number, kbps: number);
        encodeBuffer(left: Int16Array, right?: Int16Array): Uint8Array;
        flush(): Uint8Array;
    }

    interface LameJS {
        Mp3Encoder: typeof Mp3Encoder;
    }

    const lamejs: LameJS;
    export = lamejs;
}
