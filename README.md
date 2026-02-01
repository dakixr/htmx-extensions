# HTMX Extensions

Lightweight, zero-dependency HTMX extensions. No build step required.

## Extensions

### [@dakixr/htmx-global-indicator](./packages/global-indicator/)

Smart loading indicators that overlay only the target element being updated.

**Features:**
- Scoped overlays on target elements (full-screen for body/boosted requests)
- Configurable delays: 100ms for overlay, 400ms for spinner
- Automatic handling of concurrent requests
- Ignores preloaded requests (`HX-Preloaded` header)
- Dark mode support (detects `.dark` class)
- Opt-out via `hx-disinherit="global-indicator"`

```html
<script src="https://unpkg.com/htmx.org"></script>
<script src="packages/global-indicator/global-indicator.js"></script>

<div hx-get="/endpoint" hx-ext="global-indicator">
  Click to load
</div>
```

### [@dakixr/htmx-download](./packages/download/)

File downloads (Excel, PDF, etc.) without page reload.

**Features:**
- Binary file downloads without DOM swapping
- Automatic filename extraction from `Content-Disposition` header
- Works with any file type

```html
<script src="https://unpkg.com/htmx.org"></script>
<script src="packages/download/htmx-download.js"></script>

<button hx-get="/download/report" hx-ext="htmx-download">
  Download Report
</button>
```

### [@dakixr/htmx-restore-history](./packages/restore-history/)

Programmatic history restoration for custom navigation logic.

```html
<script src="https://unpkg.com/htmx.org"></script>
<script src="packages/restore-history/restore-history.js"></script>

<script>
  // Navigate programmatically while keeping HTMX history in sync
  htmx.restoreHistory('/some/path');
</script>
```

## Requirements

- HTMX 1.9.0+ or 2.0.0+

## License

MIT
