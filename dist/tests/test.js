"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graceful_fs_1 = require("graceful-fs");
const request_1 = require("request");
const index_1 = require("../index");
const file = process.argv[2];
const reader = file.startsWith("http") ? request_1.get(file) : graceful_fs_1.createReadStream(file);
const gzip = new index_1.GzipStream();
let i = 0;
reader
    .pipe(gzip)
    .pipe(process.stdout);
//# sourceMappingURL=test.js.map