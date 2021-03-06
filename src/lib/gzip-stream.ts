import { Transform, TransformOptions } from "stream"
import { gunzipSync } from "zlib"

export class GzipStream extends Transform {
   private _unused: Array<Buffer>
   // zero based index of 10 header bytes
   private _memberStartsAt: number
   private _memberEndsAt: number
   // 10 header bytes to make the start of the next gzip member
   private _hBytes: Buffer

   constructor(private _opt: TransformOptions = {}) {
      super(_opt)
      this._unused = []
      this._memberStartsAt = 0
      this._memberEndsAt = this._memberStartsAt - 1
      // refer this answer :- https://stackoverflow.com/a/13112937/4850220
      // 10 bytes header and is equivalent to <Buffer 1f 8b 08 00 00 00 00 00 00 00>
      this._hBytes = Buffer.from([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
   }

   // Logic is simple. I am used the first 10 header bytes to mark the start 
   // and end of the gzip member.
   _transform(chunk: Buffer, enc: string, done: (value?: any) => void) {
      this._unused.push(chunk)
      const unusedBuf = Buffer.concat(this._unused)

      // offset is _MemberStartsAt but in current unusedBuf
      // However, this._MemberStartsAt is relative to all the previous data.
      let offset = 0
      while (true) {
         const i = unusedBuf.indexOf(this._hBytes, offset + 1)
         if (i < 0) break

         const member = unusedBuf.slice(offset, i)
         const decompressed = gunzipSync(member)
         
         // Updating the start and end of of member
         this._memberStartsAt = this._memberEndsAt + 1
         this._memberEndsAt += member.length
         
         this.push(decompressed)
         
         offset = i
      }
      
      // Updating _unused only when offset is not zero,
      // meaning when new members are found in the current chunk
      if (offset > 0) {
         // empty the _unused array
         this._unused.splice(0)
         this._unused.push(unusedBuf.slice(offset))
      }      
      done()
   }

   _flush(done: (value?: any) => void) {
      if (this._unused.length) {
         const member = Buffer.concat(this._unused)

         // Updating the start and end of of member
         this._memberStartsAt = this._memberEndsAt + 1
         this._memberEndsAt += member.length

         const decompressed = gunzipSync(member)
         this.push(decompressed)
      }
      this._cleanUp()
      done()
   }

   private _cleanUp() {
      this._unused = null
      this._memberStartsAt = null
      this._memberEndsAt = null
      this._hBytes = null
   }

   public getMemberStart() {
      return this._memberStartsAt
   }

   public getMemberEnd() {
      return this._memberEndsAt
   }
}