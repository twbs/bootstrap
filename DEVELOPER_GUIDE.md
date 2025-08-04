# Developer Guide: Bootstrap Arbitrary Values

## Quick Start

1. **Include the extended Bootstrap utilities CSS**:
   ```html
   <link href="dist/css/bootstrap-utilities.css" rel="stylesheet">
   ```

2. **Use arbitrary values in your HTML**:
   ```html
   <div class="mt-[300px] p-[25%]">
     Custom spacing with arbitrary values
   </div>
   ```

## Available Arbitrary Values

The current implementation includes these pre-generated arbitrary values:

### Pixels
- `[300px]` - Large spacing for hero sections
- Common usage: `mt-[300px]`, `p-[300px]`, `mx-[300px]`

### Percentages  
- `[25%]` - Quarter-based responsive spacing
- Common usage: `mb-[25%]`, `py-[25%]`, `mx-[25%]`

### Rem Units
- `[2rem]` - Typography-based spacing
- Common usage: `mt-[2rem]`, `px-[2rem]`, `my-[2rem]`

### Viewport Units
- `[10vh]` - Vertical viewport spacing
- `[10vw]` - Horizontal viewport spacing
- Common usage: `mt-[10vh]`, `ps-[10vw]`, `py-[10vh]`

### Special Values
- `[auto]` - For centering and auto margins
- `[0]` - Reset spacing to zero

## Class Naming Convention

The syntax follows Bootstrap's existing pattern:
```
{property}-[{value}]
```

Where:
- `property` = `m`, `mt`, `mb`, `ms`, `me`, `mx`, `my`, `p`, `pt`, `pb`, `ps`, `pe`, `px`, `py`
- `value` = any valid CSS length value in brackets

## Examples by Use Case

### Hero Sections
```html
<!-- Full viewport height with centered content -->
<section class="py-[10vh] px-[25%]">
  <h1>Hero Title</h1>
</section>
```

### Card Layouts
```html
<!-- Large padding for spacious cards -->
<div class="card p-[300px]">
  <h3>Card Title</h3>
  <p>Card content with generous padding</p>
</div>
```

### Responsive Spacing
```html
<!-- Percentage-based margins for responsive design -->
<div class="mx-[25%] my-[2rem]">
  <p>Content with responsive horizontal margins</p>
</div>
```

### Negative Spacing for Overlaps
```html
<!-- Pull element up to overlap previous section -->
<div class="-mt-[300px] ms-[2rem]">
  <img src="image.jpg" alt="Overlapping image">
</div>
```

## Building Custom Values

To add your own arbitrary values:

1. **Edit the extended API file**:
   ```scss
   // In scss/utilities/_api-extended.scss
   .mt-\[500px\] {
     margin-top: 500px !important;
   }
   ```

2. **Recompile the CSS**:
   ```bash
   npm run css-compile
   ```

## Performance Tips

1. **Only include values you use** - Remove unused arbitrary values to reduce CSS size
2. **Use CSS purging** - Tools like PurgeCSS can remove unused classes
3. **Combine with standard Bootstrap** - Mix arbitrary values with Bootstrap's standard spacing scale

## Debugging

### Browser DevTools
Inspect elements to see the generated CSS:
```css
.mt-\[300px\] {
  margin-top: 300px !important;
}
```

### CSS Class Validation
Check that your classes are properly escaped in CSS:
- ✅ `.mt-\[300px\]` - Correct escaping
- ❌ `.mt-[300px]` - Will not work in CSS

## Common Patterns

### Centering with Auto Margins
```html
<div class="mx-[auto]" style="width: 500px;">
  Centered content
</div>
```

### Viewport-Based Spacing
```html
<!-- Mobile-first hero with viewport spacing -->
<section class="py-[10vh]">
  <div class="px-[10vw]">
    <h1>Responsive Hero</h1>
  </div>
</section>
```

### Mixed Standard and Arbitrary Values
```html
<!-- Combine Bootstrap standards with custom values -->
<div class="mb-3 mt-[300px] px-4 py-[25%]">
  Mixed spacing approach
</div>
```

## Browser Compatibility

Arbitrary values work in all browsers that support:
- CSS custom properties (IE11+)
- CSS calc() function (IE9+)
- Basic CSS units (all browsers)

## Migration from Other Frameworks

### From Tailwind CSS
```html
<!-- Tailwind -->
<div class="mt-[300px] p-[25%]">

<!-- Bootstrap with Arbitrary Values -->
<div class="mt-[300px] p-[25%]">
```
The syntax is identical for most cases!

### From Custom CSS
```css
/* Before: Custom CSS */
.my-custom-spacing {
  margin-top: 300px;
  padding: 25%;
}
```

```html
<!-- After: Bootstrap Arbitrary Values -->
<div class="mt-[300px] p-[25%]">
```

## Testing Your Implementation

Use the included demo files:
- `test-arbitrary-values.html` - Basic functionality test
- `demo-arbitrary-values.html` - Comprehensive examples

Open in browser and inspect elements to verify CSS generation.

## Troubleshooting

### Classes Not Working
1. Check CSS is compiled with `npm run css-compile`
2. Verify the CSS file includes your arbitrary values
3. Check HTML class names match exactly (case-sensitive)

### Styling Conflicts
1. Arbitrary values use `!important` by default
2. They follow Bootstrap's specificity rules
3. Later classes override earlier ones

### Escaping Issues
1. Use proper backslash escaping in CSS: `\[` and `\]`
2. HTML classes don't need escaping: `class="mt-[300px]"`
