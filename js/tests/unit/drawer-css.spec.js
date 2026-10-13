import drawerCss from '../../../scss/_drawer.scss?inline'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Drawer CSS layers', () => {
  let fixtureEl
  let styleEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  beforeEach(() => {
    styleEl = document.createElement('style')
    styleEl.textContent = `
      @layer components, custom;
      ${drawerCss}
      @layer custom {
        .drawer-custom-width {
          --drawer-width: 512px;
        }
      }
    `
    document.head.append(styleEl)
  })

  afterEach(() => {
    styleEl.remove()
    clearFixture()
  })

  for (const className of ['drawer', 'sm:drawer', 'md:drawer', 'lg:drawer', 'xl:drawer', '2xl:drawer']) {
    it(`should retain the default width token for .${className}`, () => {
      const element = document.createElement('div')
      element.className = className
      fixtureEl.append(element)

      expect(getComputedStyle(element).getPropertyValue('--drawer-width').trim()).toBe('400px')
    })

    it(`should allow a later layer to override the width token for .${className}`, () => {
      const element = document.createElement('div')
      element.classList.add(className, 'drawer-custom-width')
      fixtureEl.append(element)

      expect(getComputedStyle(element).getPropertyValue('--drawer-width').trim()).toBe('512px')
    })
  }
})
