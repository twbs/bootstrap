---
layout: docs
title: Flex
description: Quickly manage the layout, alignment, and sizing of grid columns, navigation, components, and more with a full suite of responsive flexbox utilities. For more complex implementations, custom CSS may be necessary.
group: utilities
toc: true
---

## Enable flex behaviors

Apply `display` utilities to create a flexbox container and transform **direct children elements** into flex items. Flex containers and items are able to be modified further with additional flex properties.

{{< example >}}
<div class="d-flex p-2 bd-highlight">I'm a flexbox container!</div>
{{< /example >}}

{{< example >}}
<div class="d-inline-flex p-2 bd-highlight">I'm an inline flexbox container!</div>
{{< /example >}}

Responsive variations also exist for `.d-flex` and `.d-inline-flex`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.d{{ .abbr }}-flex`
- `.d{{ .abbr }}-inline-flex`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Direction

Set the direction of flex items in a flex container with direction utilities. In most cases you can omit the horizontal class here as the browser default is `row`. However, you may encounter situations where you needed to explicitly set this value (like responsive layouts).

Use `.flex-row` to set a horizontal direction (the browser default), or `.flex-row-reverse` to start the horizontal direction from the opposite side.

{{< example >}}
<div class="d-flex flex-row bd-highlight mb-3">
  <div class="p-2 bd-highlight">Flex item 1</div>
  <div class="p-2 bd-highlight">Flex item 2</div>
  <div class="p-2 bd-highlight">Flex item 3</div>
</div>
<div class="d-flex flex-row-reverse bd-highlight">
  <div class="p-2 bd-highlight">Flex item 1</div>
  <div class="p-2 bd-highlight">Flex item 2</div>
  <div class="p-2 bd-highlight">Flex item 3</div>
</div>
{{< /example >}}

Use `.flex-column` to set a vertical direction, or `.flex-column-reverse`  to start the vertical direction from the opposite side.

{{< example >}}
<div class="d-flex flex-column bd-highlight mb-3">
  <div class="p-2 bd-highlight">Flex item 1</div>
  <div class="p-2 bd-highlight">Flex item 2</div>
  <div class="p-2 bd-highlight">Flex item 3</div>
</div>
<div class="d-flex flex-column-reverse bd-highlight">
  <div class="p-2 bd-highlight">Flex item 1</div>
  <div class="p-2 bd-highlight">Flex item 2</div>
  <div class="p-2 bd-highlight">Flex item 3</div>
</div>
{{< /example >}}

Responsive variations also exist for `flex-direction`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-row`
- `.flex{{ .abbr }}-row-reverse`
- `.flex{{ .abbr }}-column`
- `.flex{{ .abbr }}-column-reverse`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Justify content

Use `justify-content` utilities on flexbox containers to change the alignment of flex items on the main axis (the x-axis to start, y-axis if `flex-direction: column`). Choose from `start` (browser default), `end`, `center`, `between`, `around`, or `evenly`.

<div class="bd-example">
  <div class="d-flex justify-content-start bd-highlight mb-3">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex justify-content-end bd-highlight mb-3">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex justify-content-center bd-highlight mb-3">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex justify-content-between bd-highlight mb-3">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex justify-content-around bd-highlight">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex justify-content-evenly bd-highlight">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex justify-content-start">...</div>
<div class="d-flex justify-content-end">...</div>
<div class="d-flex justify-content-center">...</div>
<div class="d-flex justify-content-between">...</div>
<div class="d-flex justify-content-around">...</div>
<div class="d-flex justify-content-evenly">...</div>
```

Responsive variations also exist for `justify-content`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.justify-content{{ .abbr }}-start`
- `.justify-content{{ .abbr }}-end`
- `.justify-content{{ .abbr }}-center`
- `.justify-content{{ .abbr }}-between`
- `.justify-content{{ .abbr }}-around`
- `.justify-content{{ .abbr }}-evenly`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Align items

Use `align-items` utilities on flexbox containers to change the alignment of flex items on the cross axis (the y-axis to start, x-axis if `flex-direction: column`). Choose from `start`, `end`, `center`, `baseline`, or `stretch` (browser default).

<div class="bd-example">
  <div class="d-flex align-items-start bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex align-items-end bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex align-items-center bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex align-items-baseline bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex align-items-stretch bd-highlight" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex align-items-start">...</div>
<div class="d-flex align-items-end">...</div>
<div class="d-flex align-items-center">...</div>
<div class="d-flex align-items-baseline">...</div>
<div class="d-flex align-items-stretch">...</div>
```

Responsive variations also exist for `align-items`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.align-items{{ .abbr }}-start`
- `.align-items{{ .abbr }}-end`
- `.align-items{{ .abbr }}-center`
- `.align-items{{ .abbr }}-baseline`
- `.align-items{{ .abbr }}-stretch`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Align self

Use `align-self` utilities on flexbox items to individually change their alignment on the cross axis (the y-axis to start, x-axis if `flex-direction: column`). Choose from the same options as `align-items`: `start`, `end`, `center`, `baseline`, or `stretch` (browser default).

<div class="bd-example">
  <div class="d-flex bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="align-self-start p-2 bd-highlight">Aligned flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="align-self-end p-2 bd-highlight">Aligned flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="align-self-center p-2 bd-highlight">Aligned flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex bd-highlight mb-3" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="align-self-baseline p-2 bd-highlight">Aligned flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
  <div class="d-flex bd-highlight" style="height: 100px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="align-self-stretch p-2 bd-highlight">Aligned flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="align-self-start">Aligned flex item</div>
<div class="align-self-end">Aligned flex item</div>
<div class="align-self-center">Aligned flex item</div>
<div class="align-self-baseline">Aligned flex item</div>
<div class="align-self-stretch">Aligned flex item</div>
```

Responsive variations also exist for `align-self`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.align-self{{ .abbr }}-start`
- `.align-self{{ .abbr }}-end`
- `.align-self{{ .abbr }}-center`
- `.align-self{{ .abbr }}-baseline`
- `.align-self{{ .abbr }}-stretch`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Fill

Use the `.flex-fill` class on a series of sibling elements to force them into widths equal to their content (or equal widths if their content does not surpass their border-boxes) while taking up all available horizontal space.

{{< example >}}
<div class="d-flex bd-highlight">
  <div class="p-2 flex-fill bd-highlight">Flex item with a lot of content</div>
  <div class="p-2 flex-fill bd-highlight">Flex item</div>
  <div class="p-2 flex-fill bd-highlight">Flex item</div>
</div>
{{< /example >}}

Responsive variations also exist for `flex-fill`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-fill`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Grow and shrink

Use `.flex-grow-*` utilities to toggle a flex item's ability to grow to fill available space. In the example below, the `.flex-grow-1` elements uses all available space it can, while allowing the remaining two flex items their necessary space.

{{< example >}}
<div class="d-flex bd-highlight">
  <div class="p-2 flex-grow-1 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Third flex item</div>
</div>
{{< /example >}}

Use `.flex-shrink-*` utilities to toggle a flex item's ability to shrink if necessary. In the example below, the second flex item with `.flex-shrink-1` is forced to wrap its contents to a new line, "shrinking" to allow more space for the previous flex item with `.w-100`.

{{< example >}}
<div class="d-flex bd-highlight">
  <div class="p-2 w-100 bd-highlight">Flex item</div>
  <div class="p-2 flex-shrink-1 bd-highlight">Flex item</div>
</div>
{{< /example >}}

Responsive variations also exist for `flex-grow` and `flex-shrink`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-{grow|shrink}-0`
- `.flex{{ .abbr }}-{grow|shrink}-1`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Auto margins

Flexbox can do some pretty awesome things when you mix flex alignments with auto margins. Shown below are three examples of controlling flex items via auto margins: default (no auto margin), pushing two items to the right (`.me-auto`), and pushing two items to the left (`.ms-auto`).

{{< example >}}
<div class="d-flex bd-highlight mb-3">
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
</div>

<div class="d-flex bd-highlight mb-3">
  <div class="me-auto p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
</div>

<div class="d-flex bd-highlight mb-3">
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="ms-auto p-2 bd-highlight">Flex item</div>
</div>
{{< /example >}}

### With align-items

Vertically move one flex item to the top or bottom of a container by mixing `align-items`, `flex-direction: column`, and `margin-top: auto` or `margin-bottom: auto`.

{{< example >}}
<div class="d-flex align-items-start flex-column bd-highlight mb-3" style="height: 200px;">
  <div class="mb-auto p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
</div>

<div class="d-flex align-items-end flex-column bd-highlight mb-3" style="height: 200px;">
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="mt-auto p-2 bd-highlight">Flex item</div>
</div>
{{< /example >}}

## Wrap

Change how flex items wrap in a flex container. Choose from no wrapping at all (the browser default) with `.flex-nowrap`, wrapping with `.flex-wrap`, or reverse wrapping with `.flex-wrap-reverse`.

<div class="bd-example">
  <div class="d-flex flex-nowrap bd-highlight" style="width: 8rem;">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex flex-nowrap">
  ...
</div>
```

<div class="bd-example">
  <div class="d-flex flex-wrap bd-highlight">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex flex-wrap">
  ...
</div>
```

<div class="bd-example">
  <div class="d-flex flex-wrap-reverse bd-highlight">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex flex-wrap-reverse">
  ...
</div>
```


Responsive variations also exist for `flex-wrap`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-nowrap`
- `.flex{{ .abbr }}-wrap`
- `.flex{{ .abbr }}-wrap-reverse`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Order

Change the _visual_ order of specific flex items with a handful of `order` utilities. We only provide options for making an item first or last, as well as a reset to use the DOM order. As `order` takes any integer value from 0 to 5, add custom CSS for any additional values needed.

{{< example >}}
<div class="d-flex flex-nowrap bd-highlight">
  <div class="order-3 p-2 bd-highlight">First flex item</div>
  <div class="order-2 p-2 bd-highlight">Second flex item</div>
  <div class="order-1 p-2 bd-highlight">Third flex item</div>
</div>
{{< /example >}}

Responsive variations also exist for `order`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $bp := $.Site.Data.breakpoints -}}
{{- range (seq 0 5) }}
- `.order{{ $bp.abbr }}-{{ . }}`
{{- end -}}
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

Additionally there are also responsive `.order-first` and `.order-last` classes that change the `order` of an element by applying `order: -1` and `order: 6`, respectively.

{{< markdown >}}
{{< flex.inline >}}
{{- range $bp := $.Site.Data.breakpoints -}}
{{- range (slice "first" "last") }}
- `.order{{ $bp.abbr }}-{{ . }}`
{{- end -}}
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}

## Align content

Use `align-content` utilities on flexbox containers to align flex items *together* on the cross axis. Choose from `start` (browser default), `end`, `center`, `between`, `around`, or `stretch`. To demonstrate these utilities, we've enforced `flex-wrap: wrap` and increased the number of flex items.

**Heads up!** This property has no effect on single rows of flex items.

<div class="bd-example">
  <div class="d-flex align-content-start flex-wrap bd-highlight mb-3" style="height: 200px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex align-content-start flex-wrap">
  ...
</div>
```

<div class="bd-example">
  <div class="d-flex align-content-end flex-wrap bd-highlight mb-3" style="height: 200px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex align-content-end flex-wrap">...</div>
```

<div class="bd-example">
  <div class="d-flex align-content-center flex-wrap bd-highlight mb-3" style="height: 200px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex align-content-center flex-wrap">...</div>
```

<div class="bd-example">
  <div class="d-flex align-content-between flex-wrap bd-highlight mb-3" style="height: 200px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex align-content-between flex-wrap">...</div>
```

<div class="bd-example">
  <div class="d-flex align-content-around flex-wrap bd-highlight mb-3" style="height: 200px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex align-content-around flex-wrap">...</div>
```

<div class="bd-example">
  <div class="d-flex align-content-stretch flex-wrap bd-highlight mb-3" style="height: 200px">
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
    <div class="p-2 bd-highlight">Flex item</div>
  </div>
</div>

```html
<div class="d-flex align-content-stretch flex-wrap">...</div>
```

Responsive variations also exist for `align-content`.

{{< markdown >}}
{{< flex.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.align-content{{ .abbr }}-start`
- `.align-content{{ .abbr }}-end`
- `.align-content{{ .abbr }}-center`
- `.align-content{{ .abbr }}-around`
- `.align-content{{ .abbr }}-stretch`
{{- end -}}
{{< /flex.inline >}}
{{< /markdown >}}
