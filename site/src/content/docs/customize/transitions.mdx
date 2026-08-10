---
title: Transitions
description: Learn how Bootstrap components animate, which state classes drive them, and how to retune or remove the motion.
toc: true
---

## How it works

CSS owns every component transition in Bootstrap. JavaScript only toggles a state class and then waits for the transition to finish before it fires an event or removes an element.

This means you restyle motion with CSS alone. You never have to reimplement a component to change how it animates.

Each animated component follows the same three rules:

1. The base selector holds the hidden state, plus the `transition` declaration.
2. A state class holds the visible state.
3. `@starting-style` supplies the enter-from state, because the element is not rendered before the state class lands.

The toast is the reference implementation.

<ScssDocs name="toast-transition" file="scss/_toasts.scss" />

`display` transitions with `allow-discrete` so the toast stays laid out until the fade-out ends. Without it, the element would disappear on the first frame and you would see no exit animation.

## State classes

JavaScript adds and removes a small, fixed set of classes. Style these, and your customizations follow the component.

<BsTable>
| Class | Meaning |
| --- | --- |
| `.show` | The component is shown. Its absence is the hidden state. Used by collapse, menu, popover, toast, and tooltip. Collapse toggles nothing else. |
| `.active` | The shown state for tab panes, where it also marks the selected pane. |
| `.hiding` | Present only while an exit transition plays. Bootstrap removes it after the transition ends. Used by alert, dialog, and drawer. |
| `.{component}-instant` | Opts one element out of its transition, such as `.toast-instant` or `.dialog-instant`. |
| `.{component}-static` | A short bounce that signals a modal refused to close, such as `.dialog-static`. |
</BsTable>

`.hiding` exists for components that must survive their own exit. An alert is removed from the DOM and a dialog leaves the top layer, so both need a class that marks the outgoing state. Components that only hide can drop `.show` instead.

## Customize the motion

### Token trio

Every animated component exposes the same three custom properties.

<BsTable>
| Custom property | Purpose |
| --- | --- |
| `--bs-{component}-transition-property` | The properties that animate. |
| `--bs-{component}-transition-duration` | How long the animation runs. Set it to `0s` to remove the motion. |
| `--bs-{component}-transition-timing` | The easing curve. |
</BsTable>

Because the property list is a token, you can animate something new without rewriting the whole declaration. Add `transform` to the toast list, and the toast slides as it fades. Press the button to replay it.

<div class="bd-example">
  <div class="toast-container position-static">
    <div class="toast bd-toast-slide" id="slideToast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-body">
        This toast slides up as it fades in.
      </div>
    </div>
  </div>
  <button type="button" class="btn-solid theme-primary mt-3" id="slideToastBtn">Replay</button>
</div>

```css
.toast-slide {
  --bs-toast-transition-property: opacity, transform, display;
  --bs-toast-transition-duration: .3s;
  --bs-toast-transition-timing: ease-out;

  transform: translateY(1rem);
}

.toast-slide.show {
  transform: none;
}
```

<Callout>
Keep the discrete property in the list. The toast and the menu need `display`, and the dialog and the drawer need `visibility`. That property is what keeps the element rendered until the exit animation ends.
</Callout>

### Size animations

Collapse and accordion animate a size, not an opacity, so they add [`interpolate-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size) to let `0` interpolate to the `auto` of the open state. No JavaScript measures the content. Browsers without `interpolate-size` open and close the element at once, which is why the collapse clips the animated axis at all times.

The collapse trio carries the component name last, because the two components share it.

<ScssDocs name="collapse-transition" file="scss/_transitions.scss" />

### Shared easing

Dialog, drawer, and menu read one easing curve from `:root`, so a single override restyles all three overlays.

<ScssDocs name="root-transition-variables" file="scss/_root.scss" />

## Remove the motion

You have four options, from the narrowest to the widest:

1. Add the component's `-instant` class to one element, such as `.toast-instant`.
2. Add the [`.transition-none` utility]([[docsref:/utilities/motion]]) to one element.
3. Set a `-duration` token to `0s` for a component or a subtree.
4. Set the `$enable-transitions` Sass option to `false` to remove all transitions at build time.

Bootstrap wraps its transitions in `prefers-reduced-motion: no-preference`, so users who ask for less motion already get instant state changes. See [reduced motion]([[docsref:/getting-started/accessibility#reduced-motion]]) for more.

JavaScript reads the computed transition duration before it waits. When the duration is `0s`, events and promises resolve immediately, whatever removed the motion.

## Events and promises

`show()` and `hide()` return promises that resolve after the transition ends. The matching `shown` and `hidden` events fire at the same time.

```js
const toast = new bootstrap.Toast('#myToast')

await toast.show()
// The fade-in has finished.
```

An element with no transition still resolves, just on the next tick.
