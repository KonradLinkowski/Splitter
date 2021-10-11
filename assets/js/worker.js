import { drawTree } from './image.js'
import { createTree } from './splitter.js'

self.addEventListener('message', async ({ data }) => {
  const { width, height, buffer, options: { splits, overflow, borderWidth, random } } = data
  const imageData = new ImageData(width, height)
  imageData.data.set(new Uint8ClampedArray(buffer))
  const tree = createTree(imageData, { splits, random })
  const $canvas = new OffscreenCanvas(width, height)
  const bitmap = await drawTree($canvas, imageData, tree, { overflow, borderWidth })
  self.postMessage({
    bitmap
  }, [bitmap])
})
