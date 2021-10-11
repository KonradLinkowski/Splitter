export class Scheduler {
  ready = true
  worker = new Worker('./assets/js/worker.js', { type: 'module' })
  next = null

  constructor(callback) {
    this.worker.addEventListener('message', ({ data }) => {
      const { bitmap } = data
      callback(bitmap)
      this.ready = true
      this.run()
    })

    this.worker.addEventListener('error', console.error)
    this.worker.addEventListener('messageerror', console.error)
  }

  scheduleImageGeneration(canvas, options) {
    this.next = () => {
      const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
      this.worker.postMessage({
        width: imageData.width,
        height: imageData.height,
        buffer: imageData.data.buffer,
        options
      }, [imageData.data.buffer])
    }
    this.run()
  }

  run() {
    if (this.ready && this.next) {
      this.next()
      this.next = null
      this.ready = false
    }
  }
}
