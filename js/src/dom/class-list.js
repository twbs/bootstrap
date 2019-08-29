const addClass = (element, ...classNameList) => {
  element.classList.add(...classNameList)
}

const removeClass = (element, ...classNameList) => {
  element.classList.remove(...classNameList)
}

const hasClass = (element, className) => {
  return element.classList.contains(className)
}

const toggleClass = (element, className) => {
  return element.classList.toggle(className)
}

export {
  addClass,
  removeClass,
  hasClass,
  toggleClass
}
