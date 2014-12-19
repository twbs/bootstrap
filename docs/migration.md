---
layout: page
title: Migrating to v4.x.x
---

## Summary

For a broader overview, see [what's new](http://blog.getbootstrap.com/DEAD-LINK-FIX-ME-PLEASE) in the v4.0.0 release announcement.

- Dropped IE8 support—v4 is now only IE9+. For sites needing IE8, use v3.
- Switched from `px` to `rem` as our primary unit in CSS.
- Media queries are now in `em`s.
- Global font-size increased from `14px` to `16px`.
- Dropped panels, thumbnails, and wells for a new component, cards.
- Switched from LESS to SCSS for our source CSS files.
- Added a new grid tier for ~`480px` and below.
- Dropped Glyphicons icon font.
- Refactored nearly all components to use more unnested classes instead of children selectors.

## Major class changes

This table shows the style changes between v3.x.x and v4.0.0.

| Bootstrap 3.x.x | Bootstrap 4.0.0 |
| --- | --- |
|  |  |

## What's new
We've added new components and changed some existing ones. Here are the new or updated styles.

| Component | Description |
| --- | --- |
| Cards | New, more flexible component to replace v3's panels, thumbnails, and wells. |
| New navbar | Replaces the previous navbar with a new, simpler component. |
| New progress bars | Replaces the old `.progress` with a real `<progress>` element. |

## What's removed
The following components have been removed in v4.0.0.

| Component | Removed from 3.x.x | 4.0.0 Equivalent |
| --- | --- | --- |
|  |  |  |

## Additional notes
