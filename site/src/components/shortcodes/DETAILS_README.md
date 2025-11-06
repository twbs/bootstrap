# Details Component

The Details component is an expandable/collapsible content component that looks similar to the Callout component but requires a click to reveal the full content. It uses the native HTML `<details>` and `<summary>` elements under the hood.

## Features

- **Expandable/Collapsible**: Content is hidden by default and expands when the summary is clicked
- **Markdown Support**: Can reference external `.md` files using the `name` prop
- **Flexible Content**: Accepts inline content via slot or named markdown files
- **Simple Styling**: Single, unified design that works everywhere

## Usage

### Basic Usage with Inline Content

```astro
<Details summary="Click to expand">
  This is the content that will be hidden until the user clicks the summary.
</Details>
```

### With Named Content (External Markdown File)

Create a markdown file in `site/src/content/details/` with a `title` in the frontmatter:

```markdown
<!-- site/src/content/details/my-example.md -->
---
title: Click to see more
---

**This is the content** from an external markdown file.

It supports full markdown formatting including:
- Lists
- Links
- **Bold** and *italic* text
```

Then use it in your component (the title from frontmatter will be used as the summary):

```astro
<Details name="my-example" />
```

You can also override the title with a custom summary:

```astro
<Details summary="Custom summary text" name="my-example" />
```

### With Markdown Formatting in Slot

```astro
<Details summary="Advanced usage">
  You can use **markdown** formatting, including:

  - Lists
  - [Links](#)
  - `code`
  - And more!
</Details>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `summary` | `string` | *Optional* | The text displayed in the summary (always visible). If not provided, uses the `title` from the markdown frontmatter when `name` is set. |
| `name` | `string` | `undefined` | Reference to a markdown file in `src/content/details/` |

**Note:** Either `summary` must be provided, or `name` must reference a markdown file with a `title` in its frontmatter.

## Creating Named Content Files

1. Create a new `.md` file in `site/src/content/details/`
2. Add a `title` in the frontmatter for the summary text
3. Write your markdown content
4. Reference it using the `name` prop (without the `.md` extension)

Example:

```bash
# Create the file
cat > site/src/content/details/api-notes.md << EOF
---
title: API Authentication Notes
---

**API Note:** This endpoint requires authentication.
EOF
```

```astro
<!-- Use it (title from frontmatter is used automatically) -->
<Details name="api-notes" />

<!-- Or override the title with a custom summary -->
<Details summary="Custom summary" name="api-notes" />
```

## Styling

The Details component has a simple, unified style:
- `.bd-details` - Base class with neutral, theme-aware styling
- Uses Bootstrap's tertiary background color
- Automatically adapts to light and dark modes

The styling is defined in `site/src/scss/_details.scss`.

## Examples

See the [Docs Reference](/docsref/) page for live examples of the Details component in action.

## When to Use

**Use Details when:**
- Content is supplementary and doesn't need to be immediately visible
- You want to reduce visual clutter on the page
- Information is relevant but not critical to understanding the main content
- You're documenting edge cases, advanced tips, or optional information

**Use Callout instead when:**
- Information must be immediately visible
- Content is critical to user success
- You want to draw immediate attention to important information
