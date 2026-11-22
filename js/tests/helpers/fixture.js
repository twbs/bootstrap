const FIXTURE_ID = 'fixture'

export const getFixture = () => {
  let fixtureElement = document.getElementById(FIXTURE_ID)

  if (!fixtureElement) {
    fixtureElement = document.createElement('div')
    fixtureElement.setAttribute('id', FIXTURE_ID)
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

export const clearBodyAndDocument = () => {
  const attributes = ['data-bs-padding-right', 'style']

  for (const attribute of attributes) {
    document.documentElement.removeAttribute(attribute)
    document.body.removeAttribute(attribute)
  }
}

export const clickBackdrop = element => {
  const { top } = element.getBoundingClientRect()
  const position = { clientY: Math.floor(top) - 10, detail: 1 }
  element.dispatchEvent(new PointerEvent('pointerdown', position))
  element.dispatchEvent(new MouseEvent('click', position))
}
