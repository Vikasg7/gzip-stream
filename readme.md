# gzip-stream

- ### Intro  
   **gzip-stream** is a Transform stream to read gzip file member by member.

- ### Install  
   `npm install git+https://github.com/Vikasg7/gzip-stream.git`  

- ### Usage (in TypeScript)  
   ````javascript  
   import { createReadStream } from "graceful-fs"
   import { get } from "request"
   import { GzipStream } from "gzip-stream"

   const file = process.argv[2]

   const reader = file.startsWith("http") ? get(file) : createReadStream(file)
   const gzip = new GzipStream()

   let i = 0
   reader
      .pipe(gzip)
      .on("data", (member) => console.log(member))
      .pipe(process.stdout)
   ````

- ### Example
   Check the tests folder in src folder for an example.