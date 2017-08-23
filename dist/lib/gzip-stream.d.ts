/// <reference types="node" />
import { Transform, TransformOptions } from "stream";
export declare class GzipStream extends Transform {
    private _opt;
    private _unused;
    private _memberStartsAt;
    private _memberEndsAt;
    private _hBytes;
    constructor(_opt?: TransformOptions);
    _transform(chunk: Buffer, enc: string, done: (value?: any) => void): void;
    _flush(done: (value?: any) => void): void;
    private _cleanUp();
    getMemberStart(): number;
    getMemberEnd(): number;
}
