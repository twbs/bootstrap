## Problem (security)

The HTML sanitizer's `SAFE_URL_PATTERN` only rejected `javascript:`, so a `data:text/html,…` (or `vbscript:`) URL in an `href`/`src` passed the attribute allowList. Via `data-bs-title`/`data-bs-content` (with `html: true` or a permissive `allowList`) that's an XSS vector.

## Fix

- `SAFE_URL_PATTERN` now also rejects `data:` and `vbscript:`.
- Restored a `DATA_URL_PATTERN` (as in earlier Bootstrap) that re-allows only safe **base64 image/video/audio** data URLs, so legitimate `data:image/*` sources keep working while `data:text/html` is blocked.

## Verification

- Added the dangerous URLs (`data:text/html,…`, base64 `text/html`, `vbscript:`) to the sanitizer's invalid-URL test; existing valid `data:image|video|audio` base64 URLs still pass.
- Full unit suite passes; lint clean.

Fixes #42443.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
