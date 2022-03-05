const fixtureId = 'fixture'

export const getFixture = () => {
  let fixtureElement = document.getElementById(fixtureId)

  if (!fixtureElement) {
    fixtureElement = document.createElement('div')
    fixtureElement.setAttribute('id', fixtureId)
    fixtureElement.style.position = 'absolute'
    fixtureElement.style.top = '-10000px'
    fixtureElement.style.left = '-10000px'
    fixtureElement.style.width = '10000px'
    fixtureElement.style.height = '10000px'
    document.body.append(fixtureElement)
  }

  return fixtureElement
}

export const clearFixture = () => {
  const fixtureElement = getFixture()

  fixtureElement.innerHTML = ''
}

export const createEvent = (eventName, parameters = {}) => {
  return new Event(eventName, parameters)
}

export const jQueryMock = {
  elements: undefined,
  fn: {},
  each(fn) {
    for (const element of this.elements) {
      fn.call(element)
    }
  }
}

export const clearBodyAndDocument = () => {
  const attributes = ['data-bs-padding-right', 'style']

  for (const attribute of attributes) {
    document.documentElement.removeAttribute(attribute)
    document.body.removeAttribute(attribute)
  }
}
