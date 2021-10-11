import { loadImage } from './image.js'
import { Scheduler } from './scheduler.js'

const $original = document.querySelector('#original')
const $generated = document.querySelector('#generated')
const $slider = document.querySelector('#slider')
const $sliderInput = document.querySelector('#slider-input')

const scheduler = new Scheduler(onImageReady)

$slider.addEventListener('input', () => {
  $sliderInput.value = +$slider.value
  scheduler.scheduleImageGeneration($original, +$slider.value)
})

$sliderInput.addEventListener('input', () => {
  $slider.value = +$sliderInput.value
  scheduler.scheduleImageGeneration($original, +$sliderInput.value)
})

main()

async function main() {
  const image = await loadImage('./assets/images/mona.jpg')
  const ctx = $original.getContext('2d')
  $original.width = image.naturalWidth
  $original.height = image.naturalHeight
  ctx.drawImage(image, 0, 0)
  scheduler.scheduleImageGeneration($original, 10)
}

function onImageReady(bitmap) {
  $generated.width = bitmap.width
  $generated.height = bitmap.height
  $generated.getContext('2d').drawImage(bitmap, 0, 0)
}
