const fixtureId = 'fixture'

export const getFixture = () => {
  let fixtureEl = document.getElementById(fixtureId)

  if (!fixtureEl) {
    fixtureEl = document.createElement('div')
    fixtureEl.setAttribute('id', fixtureId)
    fixtureEl.style.display = 'none'
    document.body.appendChild(fixtureEl)
  }

  return fixtureEl
}

export const clearFixture = () => {
  const fixtureEl = getFixture()

  fixtureEl.innerHTML = ''
}
