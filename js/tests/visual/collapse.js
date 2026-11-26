if (!new URLSearchParams(window.location.search).has('native')) {
  const { Collapse } = await import('../../../dist/js/bootstrap.bundle.js')
  const controls = document.querySelector('#controls')
  const cancel = document.querySelector('#cancel')
  const instant = document.querySelector('#instant')
  const output = document.querySelector('#events')
  const vertical = document.querySelector('#vertical')
  const events = []

  for (const name of ['show', 'shown', 'hide', 'hidden']) {
    document.addEventListener(`${name}.bs.collapse`, event => {
      const canceled = cancel.checked && (name === 'show' || name === 'hide')
      if (canceled) {
        event.preventDefault()
      }

      events.unshift(`${event.target.id}: ${name}${canceled ? ' (canceled)' : ''}`)
      events.length = Math.min(events.length, 6)
      output.textContent = events.join('\n')
    })
  }

  instant.addEventListener('change', () => {
    for (const panel of document.querySelectorAll('.collapse')) {
      panel.classList.toggle('collapse-instant', instant.checked)
    }
  })

  document.querySelector('#interrupt').addEventListener('click', async () => {
    const collapse = Collapse.getOrCreateInstance(vertical)
    await collapse.hide()
    const opening = collapse.show()
    setTimeout(() => {
      vertical.open = false
    }, 75)
    await opening
  })

  controls.hidden = false
}
