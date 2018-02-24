const Canvas = require('canvas')
const GifEncoder = require('gifencoder')
const w = 400, h = 400
const fs = require('fs')
class SpringBlock {
    constructor() {
        this.encoder = new GifEncoder(w, h)
        this.canvas = new Canvas()
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        this.encoder.setDelay(50)
        this.encoder.setQuality(100)
        this.encoder.setRepeat(0)
    }
    create(fileName) {
        this.encoder.createReadStream().pipe(fs.createWriteStream(fileName))
    }
}
