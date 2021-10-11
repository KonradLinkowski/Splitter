export function getAverageColor(imageData, x, y, width, height) {
  const avg = { r: 0, g: 0, b: 0 }
  const { data, width: maxWidth } = imageData
  for (let h = 0; h < height; h += 1) {
    for (let w = 0; w < width; w += 1) {
      const index = (y + h) * maxWidth * 4 + (x + w) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]

      avg.r += r
      avg.g += g
      avg.b += b
    }
  }
  avg.r = Math.floor(avg.r / (width * height))
  avg.g = Math.floor(avg.g / (width * height))
  avg.b = Math.floor(avg.b / (width * height))

  return avg
}

export async function drawTree(canvas, imageData, tree) {
  const ctx = canvas.getContext('2d')
  ctx.canvas.width = imageData.width
  ctx.canvas.height = imageData.height
  for (const node of tree.leaves) {
    ctx.fillStyle = `rgb(${node.value.r}, ${node.value.g}, ${node.value.b})`
    ctx.fillRect(
      node.x,
      node.y,
      node.width,
      node.height
    )
  }
  return await createImageBitmap(canvas)
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const $img = new Image()
    $img.onload = () => resolve($img)
    $img.onerror = reject
    $img.src = url
  })
}

