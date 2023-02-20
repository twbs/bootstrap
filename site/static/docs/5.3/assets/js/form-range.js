// Example starter JavaScript for enabling form range
(() => {
  'use strict'

  // Getting all the range inputs
  const ranges = document.querySelectorAll('#jsRange')

  // Adding a listener to every input in order to have a dynamic progress
  for (const range of ranges) {
    range.addEventListener('input', () => {
      const value = (range.value - range.min) / (range.max - range.min) * 100
      range.style.setProperty('--value', `${value}%`)
    })
  }

  document.addEventListener('DOMContentLoaded', () => {
    for (const range of ranges) {
      const value = (range.value - range.min) / (range.max - range.min) * 100
      range.style.setProperty('--value', `${value}%`)
    }
  })
})()
