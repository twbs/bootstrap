const fixtureId = 'fixture'

export const getFixture = () => {
  let fixtureEl = document.getElementById(fixtureId)

  if (!fixtureEl) {
    fixtureEl = document.createElement('div')
    fixtureEl.setAttribute('id', fixtureId)
    fixtureEl.style.position = 'absolute'
    fixtureEl.style.top = '-10000px'
    fixtureEl.style.left = '-10000px'
    fixtureEl.style.width = '10000px'
    fixtureEl.style.height = '10000px'
    document.body.append(fixtureEl)
  }

  return fixtureEl
}

export const clearFixture = () => {
  const fixtureEl = getFixture()

  fixtureEl.innerHTML = ''
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

export const clearBodyAndDocument = () => {
  const attributes = ['data-bs-padding-right', 'style']

  attributes.forEach(attr => {
    document.documentElement.removeAttribute(attr)
    document.body.removeAttribute(attr)
  })
}
