const storageKey = 'theme-preference'
const clipElement = document.createElement('div')
document.addEventListener('keypress', (event) => {
  const keyName = event.key;
  if (keyName === 'd') {
    onClick();
  }
});
const onClick = () => {
  theme.value = theme.value === 'light'
    ? 'dark'
    : 'light'
  setPreference()
}

const storedTheme = localStorage.getItem('theme')
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

const getColorPreference = () => {
  if (storedTheme) {
    return storedTheme
  }

  return prefersDarkMode ? 'dark' : 'light'
}

// const getColorPreference = () => {
//   if (localStorage.getItem(storageKey))
//     return localStorage.getItem(storageKey)
//   else
//     return localStorage.setItem('theme-preference', 'light')
//   return window.matchMedia('(prefers-color-scheme: dark)').matches
//     ? 'dark'
//     : 'light'
// }
const setPreference = () => {
  localStorage.setItem(storageKey, theme.value)
  reflectPreference()
  addTransition()
}

const reflectPreference = () => {
  document.firstElementChild.setAttribute('data-bs-theme', theme.value)
  document.querySelector('#theme-toggler')?.setAttribute('aria-label', theme.value)
}
const theme = {
  value: getColorPreference(),
}
reflectPreference()
window.onload = () => {
  reflectPreference()
  if (document.querySelector('#theme-toggler') !== null) {
    document.querySelector('#theme-toggler').addEventListener('click', onClick)
    document.body.classList.add('app-transition');
  }
}
const addTransition = () => {
  clipElement.classList.add('clip-transition')
  if(clipElement)
    document.body.prepend(clipElement);
  setTimeout(function () {
    document.body.classList.remove('app-transition')
  }, 1000);
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches: isDark}) => {
  theme.value = isDark ? 'dark' : 'light'
  setPreference()
})
