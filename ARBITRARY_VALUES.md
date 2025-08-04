# Bootstrap Arbitrary Values Extension

This extension adds support for arbitrary values in Bootstrap's spacing utilities, similar to Tailwind CSS's arbitrary value feature. You can now use custom margin and padding values with the syntax `class-[value]`.

## Features

- **Arbitrary Margin Values**: Set custom margins using `mt-[300px]`, `mb-[25%]`, etc.
- **Arbitrary Padding Values**: Set custom padding using `p-[2rem]`, `px-[10vw]`, etc.
- **Multiple Units Supported**: px, %, rem, em, vh, vw, vmin, vmax, ch, ex
- **Negative Margins**: Use negative margins with `-mt-[300px]`, `-mx-[2rem]`, etc.
- **Directional Support**: All Bootstrap spacing directions (t, b, s, e, x, y)

## Usage

### Margin Examples

```html
<!-- Margin top with pixels -->
<div class="mt-[300px]">Large top margin</div>

<!-- Margin bottom with percentage -->
<div class="mb-[25%]">Quarter height bottom margin</div>

<!-- Margin left/right with rem -->
<div class="mx-[2rem]">Horizontal margins</div>

<!-- Margin all sides with viewport height -->
<div class="m-[10vh]">All sides viewport margin</div>

<!-- Negative margin -->
<div class="-mt-[300px]">Negative top margin</div>
```

### Padding Examples

```html
<!-- Padding all sides with pixels -->
<div class="p-[300px]">Large padding</div>

<!-- Padding top/bottom with percentage -->
<div class="py-[25%]">Vertical percentage padding</div>

<!-- Padding left/right with viewport width -->
<div class="px-[10vw]">Horizontal viewport padding</div>

<!-- Padding individual sides -->
<div class="pt-[2rem] pb-[1rem]">Different top/bottom padding</div>
```

## Supported Classes

### Margin Classes
- `m-[value]` - All sides margin
- `mt-[value]` - Top margin
- `mb-[value]` - Bottom margin
- `ms-[value]` - Start (left) margin
- `me-[value]` - End (right) margin
- `mx-[value]` - Horizontal (left/right) margins
- `my-[value]` - Vertical (top/bottom) margins

### Padding Classes
- `p-[value]` - All sides padding
- `pt-[value]` - Top padding
- `pb-[value]` - Bottom padding
- `ps-[value]` - Start (left) padding
- `pe-[value]` - End (right) padding
- `px-[value]` - Horizontal (left/right) padding
- `py-[value]` - Vertical (top/bottom) padding

### Negative Margin Classes
- `-m-[value]` - All sides negative margin
- `-mt-[value]` - Top negative margin
- `-mb-[value]` - Bottom negative margin
- `-ms-[value]` - Start (left) negative margin
- `-me-[value]` - End (right) negative margin
- `-mx-[value]` - Horizontal negative margins
- `-my-[value]` - Vertical negative margins

## Supported Units

- **Pixels**: `[300px]`, `[50px]`, `[10px]`
- **Percentages**: `[25%]`, `[50%]`, `[100%]`
- **Rem units**: `[2rem]`, `[1.5rem]`, `[0.5rem]`
- **Em units**: `[2em]`, `[1.5em]`
- **Viewport units**: `[10vh]`, `[50vw]`, `[25vmin]`, `[75vmax]`
- **Character units**: `[20ch]`, `[5ex]`
- **Special values**: `[auto]`, `[0]`

## Implementation Details

The arbitrary values are implemented as CSS classes that are pre-generated during the build process. The current implementation includes the most commonly used arbitrary values:

- Common pixel values: 300px
- Common percentages: 25%
- Common rem values: 2rem
- Common viewport values: 10vh, 10vw

## Extending the Implementation

To add more arbitrary values, edit `/scss/utilities/_api-extended.scss` and add new classes following the pattern:

```scss
.mt-\[your-value\] {
  margin-top: your-value !important;
}
```

Then recompile the CSS using:

```bash
npm run css-compile
```

## Future Enhancements

Future versions could include:

1. **Build-time scanning**: Automatically detect arbitrary values used in HTML files
2. **Responsive arbitrary values**: Support for `sm:mt-[300px]`, `lg:p-[25%]`
3. **More CSS properties**: Extend to width, height, font-size, etc.
4. **Dynamic generation**: Runtime CSS generation for arbitrary values

## Compatibility

This extension is compatible with Bootstrap 5.3.7+ and doesn't interfere with existing Bootstrap utilities. All existing Bootstrap spacing classes continue to work as expected.

## Performance Considerations

The current implementation pre-generates common arbitrary values, which adds to the CSS file size. In production, consider:

1. Only including the arbitrary values you actually use
2. Using CSS purging tools to remove unused classes
3. Implementing on-demand generation for frequently changing values

## Browser Support

Arbitrary values work in all browsers that support Bootstrap 5, as they compile to standard CSS properties.
