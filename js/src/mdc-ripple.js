import { MDCRipple, MDCRippleFoundation } from '@material/ripple'

class MDCRippled {
  constructor(element) {
    this.root = element
    this.active = false
    this.root.addEventListener('keydown', evt => {
      if (isSpace(evt)) {
        this.active = true
      }
    })
    this.root.addEventListener('keyup', evt => {
      if (isSpace(evt)) {
        this.active = false
      }
    })
    this.root.addEventListener('mouseenter', evt => {
      if (isSpace(evt)) {
        this.active = false
      }
    })
    this.root.addEventListener('mouseleave', evt => {
      if (isSpace(evt)) {
        this.active = false
      }
    })
    const foundation = new MDCRippleFoundation({
      ...MDCRipple.createAdapter(this), isSurfaceActive: () => this.active
    })
    this.ripple = new MDCRipple(this.root, foundation)
  }
}

function isSpace(evt) {
  return evt.key === ' ' || evt.keyCode === 32
}

function addRippleToElements(selector, classToAdd) {
  const elements = document.querySelectorAll(selector)

  for (const element of elements) {
    window.addEventListener('load', () => {
      element.unbounded = true
      element.classList.add(classToAdd)
      return new MDCRipple(element)
    })
  }
}

addRippleToElements('.btn-close, .btn-icon', 'mdc-icon-button')
addRippleToElements('.btn', 'mdc-button')

// const buttonEls = Array.from(mainEl.querySelectorAll('.mdc-button, .mdc-fab'))
// buttonEls.forEach((el) => mdc.ripple.MDCRipple.attachTo(el))
// const btnIconElements = document.querySelectorAll('a[class="btn-close"][class="btn-icon"], button[class="btn-close"][class="btn-icon"]')
// const btnElements = document.querySelectorAll('a[class="btn"], button[class*="btn"]')
//
// for (const btnIconElement of btnIconElements) {
//   window.addEventListener('load', () => {
//     btnIconElement.unbounded = true
//     btnIconElement.classList.add('mdc-icon-button')
//     // btnElement.classList.add('mdc-button')
//     return new MDCRipple(btnIconElement)
//   })
// }

export default MDCRippled
