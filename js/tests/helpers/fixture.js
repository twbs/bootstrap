const fixtureId = 'fixture'

export const getFixture = () => {
  let fixtureEl = document.getElementById(fixtureId)

  if (!fixtureEl) {
    fixtureEl = document.createElement('div')
    fixtureEl.setAttribute('id', fixtureId)
    document.body.appendChild(fixtureEl)
  }

  fixtureEl.removeAttribute('style')
  fixtureEl.style.position = 'absolute'
  fixtureEl.style.top = '-10000px'
  fixtureEl.style.left = '-10000px'
  fixtureEl.style.width = '10000px'
  fixtureEl.style.height = '10000px'
  return fixtureEl
}

export const clearFixture = () => {
  const fixtureEl = getFixture()

  fixtureEl.innerHTML = ''
}

export const unstyleFixture = () => {
  const fixtureEl = getFixture()
  fixtureEl.style.position = null
  fixtureEl.style.left = null
  fixtureEl.style.top = null
  fixtureEl.style.width = null
  fixtureEl.style.height = null
}

export const createEvent = (eventName, params = {}) => {
  const e = document.createEvent('Event')

  e.initEvent(eventName, Boolean(params.bubbles), Boolean(params.cancelable))
  return e
}

export const jQueryMock = {
  elements: undefined,
  fn: {},
  each(fn) {
    this.elements.forEach(el => {
      fn.call(el)
    })
  }
}
