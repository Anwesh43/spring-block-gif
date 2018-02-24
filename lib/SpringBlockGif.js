const Canvas = require('canvas')
const GifEncoder = require('gifencoder')
const w = 600, h = 600
const fs = require('fs')
class SpringBlock {
    constructor(k, m, x) {
        this.encoder = new GifEncoder(w, h)
        this.canvas = new Canvas()
        this.canvas.width = w
        this.canvas.height = h
        this.springBlock = new SpringBlock(k, m, x)
        this.renderer = new Renderer()
        this.context = this.canvas.getContext('2d')
        this.encoder.setDelay(50)
        this.encoder.setQuality(100)
        this.encoder.setRepeat(0)
    }
    create(fileName) {
        this.encoder.createReadStream().pipe(fs.createWriteStream(fileName))
        this.renderer.render(this.context, this.encoder, this.springBlock)
    }
}
class SpringBlock {
    constructor(k, m, x) {
        this.k = k
        this.m = m
        this.x = x
        this.s = 0
        this.mode = 0
    }
    updateMotionVectors() {
        if(this.x < h/40) {
            this.u = (this.k * this.x * this.x)/this.m
            this.a =  - (this.x * this.k)/(this.m)
        }
    }
    draw(context) {
        const n_springs = 10
        context.fillStyle = '#283593'
        context.strokeStyle = '#283593'
        context.save()
        context.translate(0, h/2)
        context.beginPath()
        var x = 0
        for(var i = 0; i < n_springs; i++) {
            if(i == 0) {
                context.moveTo(x, 0)
            }
            else {
                context.lineTo(x + this.s, 0)
            }
            context.lineTo(x + this.s + h/10 , -h/10)
            x += 2 * this.s + h/5
            if(i == n_springs - 1) {
                context.lineTo(x, 0)
            }
        }
        context.fillRect(x, -h/5, w/5, 2*h/5)
        context.restore()
    }
    update(stopcb) {
        switch(mode) {
            case 0:
                this.s -= this.x/10
                if(Math.abs(this.s) >= this.x) {
                    this.s = this.x
                    mode = 1
                    this.updateMotionVectors()
                }
                break
            case 1:
                this.s += this.u
                this.u += this.a
                if(this.s <= 0) {
                    this.s = 0
                    stopcb()

                }
                break
            default:
                break
        }
    }
}
class Renderer {
    constructor() {
        this.running = true
    }
    render(context, gifencoder, springBlock) {
        gifencoder.start()
        while(this.running) {
            context.fillStyle = '#212121'
            context.fillRect(0, 0, w, h)
            springBlock.draw(context)
            springBlock.update(() => {
                this.running = false
            })
            gifencoder.addFrame(context)
        }
        gifencoder.end()
    }
}
