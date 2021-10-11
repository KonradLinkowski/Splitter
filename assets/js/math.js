export function random() {
  return Math.random()
}

export function randomInt(min, max) {
  return Math.floor(randomFloat(min, max))
}

export function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}
