import { createReadStream } from "graceful-fs"
import { get } from "request"
import { GzipStream } from "../index"

const file = process.argv[2]

const reader = file.startsWith("http") ? get(file) : createReadStream(file)
const gzip = new GzipStream()

let i = 0
reader
   .pipe(gzip)
   .pipe(process.stdout)