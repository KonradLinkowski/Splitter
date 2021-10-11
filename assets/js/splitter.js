import { Tree } from './tree.js'
import { getAverageColor } from './image.js'
import { randomInt } from './math.js'

export function createTree(imageData, splits) {
  const tree = new Tree(imageData.width, imageData.height)
  for (let i = 0; i < splits; i += 1) {
    const node = tree.leaves[randomInt(0, tree.leaves.length)]
    node.split()
  }
  for (const node of tree.leaves) {
    const color = getAverageColor(
      imageData,
      node.x,
      node.y,
      node.width,
      node.height
    )
    node.value = color
  }

  return tree
}
