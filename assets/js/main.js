import { loadImage } from './image.js'
import { Scheduler } from './scheduler.js'
import { CONTROL_TYPE, createSettings } from './settings.js'

const $original = document.querySelector('#original')
const $generated = document.querySelector('#generated')

const scheduler = new Scheduler(onImageReady)

const settings = createSettings(document.body, [
  { name: 'splits', type: CONTROL_TYPE.Range, label: 'Splits', value: 10, options: { min: 0, max: 1000, step: 1 } },
  { name: 'overflow', type: CONTROL_TYPE.Range, label: 'Overflow', value: 0, options: { min: -1, max: 1, step: 0.01 } },
  { name: 'borderWidth', type: CONTROL_TYPE.Range, label: 'Border width', value: 0, options: { min: 0, max: 5, step: 1 } },
  { name: 'random', type: CONTROL_TYPE.Range, label: 'Random weight', value: 1, options: { min: 1, max: 5, step: 0.1 } }
])

settings.on('input', onUpdate)

function onUpdate({ values }) {
  scheduler.scheduleImageGeneration($original, {
    ...values
  })
}

main()

async function main() {
  const image = await loadImage('./assets/images/mona.jpg')
  const ctx = $original.getContext('2d')
  $original.width = image.naturalWidth
  $original.height = image.naturalHeight
  ctx.drawImage(image, 0, 0)
  scheduler.scheduleImageGeneration($original, {
    ...settings.getValues()
  })
}

function onImageReady(bitmap) {
  $generated.width = bitmap.width
  $generated.height = bitmap.height
  $generated.getContext('2d').drawImage(bitmap, 0, 0)
}
