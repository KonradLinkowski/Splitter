export const CONTROL_TYPE = {
  Range: Symbol('range'),
  Checkbox: Symbol('checkbox'),
  File: Symbol('checkbox')
}

export function createSettings($parent, controls) {
  const $container = document.createElement('div')
  $container.setAttribute('class', 'settings')
  $parent.appendChild($container)
  const values = {}

  const handlers = {}

  const ctrls = []
  
  for (const control of controls) {
    const ctrl = createControl(control, emitter(control.name, control.value))
    ctrl.$element.classList.add('settings-field')
    ctrls.push({ ...control, ...ctrl })
    $container.appendChild(ctrl.$element)
  }

  return {
    getValues: () => values,
    on: (name, handler) => {
      if (!(name in handlers)) {
        handlers[name] = []
      }
      handlers[name].push(handler)
    }
  }

  function emitter(id, val) {
    values[id] = val
    return (name, value) => {
      if (!(name in handlers)) {
        handlers[name] = []
      }
      values[id] = value
      for (const handler of handlers[name]) {
        handler({
          control: id,
          value: value,
          values: { ...values }
        })
      }
    }
  }
}

const controls = {
  [CONTROL_TYPE.Range]: (emit, label, value, { min, max, step }) => {
    const $div = document.createElement('div')
    $div.setAttribute('class', 'settings-range')
    const id = generateId(label)
    const $label = document.createElement('label')
    $label.setAttribute('for', id)
    $label.setAttribute('class', 'label')
    $label.textContent = label
    $div.appendChild($label)
    const $range = document.createElement('input')
    $range.setAttribute('class', 'range')
    $range.setAttribute('type', 'range')
    $range.setAttribute('min', min)
    $range.setAttribute('max', max)
    $range.setAttribute('step', step)
    $range.setAttribute('value', value)
    $div.appendChild($range)
    const $input = document.createElement('input')
    $input.setAttribute('id', id)
    $input.setAttribute('class', 'input')
    $input.setAttribute('type', 'number')
    $input.setAttribute('min', min)
    $input.setAttribute('max', max)
    $input.setAttribute('step', step)
    $input.setAttribute('value', value)
    $div.appendChild($input)

    $range.addEventListener('input', () => {
      $input.value = +$range.value
      emit('input', +$range.value)
    })

    $input.addEventListener('input', () => {
      $range.value = +$input.value
      emit('input', +$input.value)
    })

    return {
      $element: $div
    }
  },
  [CONTROL_TYPE.Checkbox]: (emit, label, value) => {
    const $div = document.createElement('div')
    const id = generateId(label)
    const $label = document.createElement('label')
    $label.setAttribute('for', id)
    $label.setAttribute('class', 'label')
    $label.textContent = label
    $div.appendChild($label)
    const $input = document.createElement('input')
    $input.setAttribute('id', id)
    $input.setAttribute('class', 'input')
    $input.setAttribute('type', 'checkbox')
    $input.checked = value
    $div.appendChild($input)

    $input.addEventListener('input', () => {
      emit('input', $input.checked)
    })

    return {
      $element: $div
    }
  },
  [CONTROL_TYPE.File]: (emit, label, value) => {
    const id = generateId(label)
    const $dropzone = document.createElement('div')
    $dropzone.setAttribute('class', 'dropzone')

    const $label = document.createElement('label')
    $label.setAttribute('for', id)
    $label.setAttribute('class', 'label')
    $dropzone.appendChild($label)

    const $icon = document.createElement('span')
    $icon.textContent = '+'
    $icon.setAttribute('class', 'icon')
    $label.appendChild($icon)

    const $description = document.createElement('p')
    $description.textContent = label
    $description.setAttribute('class', 'description')
    $label.appendChild($description)

    const $input = document.createElement('input')
    $input.setAttribute('id', id)
    $input.setAttribute('type', 'file')
    $input.setAttribute('class', 'input')
    $input.setAttribute('value', value || null)
    $input.setAttribute('accept', 'image/x-png,image/jpeg')
    $dropzone.appendChild($input)

    const resetEvents = ['dragenter', 'dragover', 'dragleave', 'drop']
    const highlightEvents = ['dragenter', 'dragover']
    const unhighlightEvents = ['dragleave', 'drop']

    resetEvents.forEach(eventName => {
      $dropzone.addEventListener(eventName, preventDefaults, false)
      document.body.addEventListener(eventName, preventDefaults, false)
    })
    highlightEvents.forEach(eventName => {
      $dropzone.addEventListener(eventName, () => $dropzone.classList.add('highlight'), false)
    })
    unhighlightEvents.forEach(eventName => {
      $dropzone.addEventListener(eventName, () => $dropzone.classList.remove('highlight'), false)
    })

    $dropzone.addEventListener('drop', ({ dataTransfer }) => handleFiles(dataTransfer.files), false)
    $dropzone.addEventListener('input', ({ target }) => handleFiles(target.files), false)

    
    function handleFiles(files) {
      if (files.length === 0) {
        console.error('No file provided')
        return
      }
      const reader = new FileReader()
      reader.addEventListener('loadend', () => {
        emit('input', reader.result)
      })
      reader.readAsDataURL(files[0])
    }

    return {
      $element: $dropzone
    }
  }
}

function createControl({ type, label, value, options }, emit) {
  if (!(type in controls)) {
    throw new Error('No such type of control')
  }

  return controls[type](emit, label, value, options)
}


function generateId(label) {
  return `settings-${label.replace(/\s/g, '-').toLowerCase()}`
}

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}
