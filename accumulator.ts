
/** an expandable buffer */
export class Accumulator {

   size: number

   /** resizable ArrayBuffer */
   flexBuf: ArrayBuffer

   /** the accumulation buffer */
   accumulator: Uint8Array;

   /** next byte (a-tail-pointer) */
   insertionPoint = 0

   // accepts an initial buffer size (defaults to 32k)
   constructor(size = 32768) {
      this.size = size
      //@ts-ignore -- Wow!  I can grow to max 3,276,800
      this.flexBuf = new ArrayBuffer( size, { maxByteLength: size * 1000 })
      this.accumulator = new Uint8Array(this.flexBuf)
   }

   /** add a byte to the accumulator */
   appendByte(val: number) {
      this.requires(1)
      this.accumulator[this.insertionPoint++] = val
   }

   /** add a buffer to the accumulator */
   appendBuffer(buf: Uint8Array) {
      const len = buf.byteLength
      this.requires(len)
      this.accumulator.set(buf, this.insertionPoint)
      this.insertionPoint += len
   }

   /** check capacity - expand the accumulator as required */
   requires(bytesRequired: number) {
      if (this.accumulator.length < this.insertionPoint + bytesRequired) {
         let newSize = this.accumulator.byteLength
         while (newSize < this.insertionPoint + bytesRequired) newSize += (this.size * 2)
         //@ts-ignore Yes we can grow our buffer without copy penalty
         this.flexBuf.resize(newSize)
         //this.accumulator = new Uint8Array(this.flexBuf)
      }
   }

   /** extract all encoded bytes
    * @returns - a trimmed encoded buffer 
    */
   extractEncoded() {
      return this.accumulator.slice(0, this.insertionPoint)
   }
}