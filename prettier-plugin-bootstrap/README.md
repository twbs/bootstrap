# prettier-plugin-bootstrap

A [Prettier](https://prettier.io/) plugin that automatically sorts Bootstrap CSS classes following the framework's recommended order.

Inspired by [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss), this plugin brings the same developer experience to Bootstrap projects.

## How it works

The plugin hooks into Prettier's existing parsers (HTML, JSX, Vue, Angular, Astro) and re-orders CSS class names in `class` and `className` attributes according to Bootstrap's architecture:

1. **Layout** — containers, grid rows, columns
2. **Components** — buttons, cards, modals, navbars, etc. (following `bootstrap.scss` import order)
3. **Helpers** — clearfix, visually-hidden, stretched-link, etc.
4. **Utilities** — following the key order of the `$utilities` map in `scss/_utilities.scss`

Responsive variants (e.g. `d-md-flex`) sort immediately after their base class (`d-flex`) and before the next category.

Unknown classes (custom classes not part of Bootstrap) are pushed to the end, preserving their original relative order.

## Installation

```bash
npm install --save-dev prettier-plugin-bootstrap
```

## Usage

Add the plugin to your Prettier configuration:

```json
{
  "plugins": ["prettier-plugin-bootstrap"]
}
```

### Before

```html
<div class="text-center p-3 container bg-primary text-white mb-4 rounded">
  <button class="px-4 btn btn-primary btn-lg rounded-pill">Click me</button>
</div>
```

### After

```html
<div class="container bg-primary text-white text-center mb-4 p-3 rounded">
  <button class="btn btn-primary btn-lg px-4 rounded-pill">Click me</button>
</div>
```

## Options

| Option                 | Type       | Default | Description                                                  |
| ---------------------- | ---------- | ------- | ------------------------------------------------------------ |
| `bootstrapAttributes`  | `string[]` | `[]`    | Additional HTML attributes containing class lists to sort    |
| `bootstrapFunctions`   | `string[]` | `[]`    | Function names whose arguments are class lists (e.g. `clsx`) |

### Example with custom attributes

```json
{
  "plugins": ["prettier-plugin-bootstrap"],
  "bootstrapAttributes": ["ngClass", "v-bind:class"]
}
```

## Sorting order

The canonical class order follows Bootstrap's source structure:

| Category       | Example classes                                     |
| -------------- | --------------------------------------------------- |
| Layout         | `container`, `row`, `col-md-6`                      |
| Typography     | `h1`, `lead`, `display-4`                           |
| Images         | `img-fluid`, `img-thumbnail`                        |
| Tables         | `table`, `table-striped`                             |
| Forms          | `form-control`, `form-select`, `input-group`        |
| Buttons        | `btn`, `btn-primary`, `btn-lg`                      |
| Components     | `card`, `modal`, `navbar`, `alert`, `badge`, etc.   |
| Helpers        | `clearfix`, `visually-hidden`, `stretched-link`     |
| Utilities      | `d-flex`, `m-3`, `p-2`, `text-center`, `bg-primary` |

Within the Utilities category, classes follow the order of the `$utilities` Sass map:

`align` → `float` → `object-fit` → `opacity` → `overflow` → `display` → `shadow` → `position` → `border` → `sizing` → `flex` → `spacing` → `typography` → `color` → `background` → `interaction` → `border-radius` → `visibility` → `z-index`

## Compatibility

- **Prettier**: v3.0.0+
- **Parsers**: HTML, Vue, Angular, Babel (JSX), TypeScript, Astro

## License

MIT
