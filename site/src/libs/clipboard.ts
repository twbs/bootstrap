import ClipboardJS from 'clipboard'

declare const bootstrap: any

const btnTitle = 'Copy'

export function initCopyButtons(
  selector: string,
  textFn: (trigger: Element) => string
): ClipboardJS {
  document.querySelectorAll(selector).forEach((btn) => {
    bootstrap.Tooltip.getOrCreateInstance(btn, { title: btnTitle })
  })

  const clipboard = new ClipboardJS(selector, { text: textFn })

  clipboard.on('success', (event) => {
    const useEl = event.trigger.querySelector('.bi use')
    const tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)
    const originalHref = useEl?.getAttribute('href')

    if (originalHref === '#check2') {
      return
    }

    tooltipBtn?.setContent({ '.tooltip-inner': 'Copied!' })

    event.trigger.addEventListener(
      'hidden.bs.tooltip',
      () => {
        tooltipBtn?.setContent({ '.tooltip-inner': btnTitle })
      },
      { once: true }
    )

    event.clearSelection()

    if (useEl) {
      useEl.setAttribute('href', '#check2')
    }

    setTimeout(() => {
      if (useEl && originalHref) {
        useEl.setAttribute('href', originalHref)
      }
    }, 2000)
  })

  clipboard.on('error', (event) => {
    const modifierKey = /mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
    const fallbackMsg = `Press ${modifierKey}C to copy`
    const tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)

    tooltipBtn?.setContent({ '.tooltip-inner': fallbackMsg })

    event.trigger.addEventListener(
      'hidden.bs.tooltip',
      () => {
        tooltipBtn?.setContent({ '.tooltip-inner': btnTitle })
      },
      { once: true }
    )
  })

  return clipboard
}
