class Node {
  value = null
  direction = null
  parent = null
  x = 0
  y = 0
  children = []

  constructor(parent, settings) {
    this.parent = parent
    this.settings = settings
    this.width = this.settings.width
    this.height = this.settings.height

    this.settings.nodes.push(this)
    this.settings.leaves.push(this)
  }

  split() {
    if (this.children.length) {
      throw new Error('Node already split')
    }
    const leftUp = new Node(this, this.settings)
    leftUp.x = this.x
    leftUp.y = this.y
    leftUp.width = Math.floor(this.width / 2)
    leftUp.height = Math.floor(this.height / 2)

    const rightUp = new Node(this, this.settings)
    rightUp.x = this.x + Math.floor(this.width / 2)
    rightUp.y = this.y
    rightUp.width = Math.ceil(this.width / 2)
    rightUp.height = Math.floor(this.height / 2)

    const leftDown = new Node(this, this.settings)
    leftDown.x = this.x
    leftDown.y = this.y + Math.floor(this.height / 2)
    leftDown.width = Math.floor(this.width / 2)
    leftDown.height = Math.ceil(this.height / 2)

    const rightDown = new Node(this, this.settings)
    rightDown.x = this.x + Math.floor(this.width / 2)
    rightDown.y = this.y + Math.floor(this.height / 2)
    rightDown.width = Math.ceil(this.width / 2)
    rightDown.height = Math.ceil(this.height / 2)

    this.children.push(leftUp, rightUp, leftDown, rightDown)
    const index = this.settings.leaves.indexOf(this)
    this.settings.leaves.splice(index, 1)
  }
}

export class Tree {
  nodes = []
  leaves = []
  root = null

  constructor(width, height) {
    this.root = new Node(null, {
      height: height,
      width: width,
      nodes: this.nodes,
      leaves: this.leaves
    })
  }
}
