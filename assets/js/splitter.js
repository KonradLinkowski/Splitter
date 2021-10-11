import { Tree } from './tree.js'
import { getAverageColor } from './image.js'

export function createTree(imageData, { splits, random }) {
  const tree = new Tree(imageData.width, imageData.height)
  for (let i = 0; i < splits; i += 1) {
    tree.leaves.sort((a, b) => a.level - b.level)
    const index = Math.floor(Math.pow(Math.random(), random) * tree.leaves.length)
    const node = tree.leaves[index]
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
