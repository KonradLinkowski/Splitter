import { drawTree } from './image.js'
import { createTree } from './splitter.js'

self.addEventListener('message', async ({ data }) => {
  const { splits, width, height, buffer } = data
  const imageData = new ImageData(width, height)
  imageData.data.set(new Uint8ClampedArray(buffer))
  const tree = createTree(imageData, splits)
  const $canvas = new OffscreenCanvas(width, height)
  const bitmap = await drawTree($canvas, imageData, tree)
  self.postMessage({
    bitmap
  }, [bitmap])
})
