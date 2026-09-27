# HTMX Extensions

Lightweight, zero-dependency HTMX extensions. No build step required.

## Extensions

### [@dakixr/htmx-global-indicator](./packages/global-indicator/)

Loading feedback that only shows up when a request is actually slow.

**Features:**
- Dims only the swap target after 200ms, adds a spinner after 1s
- Top progress bar for page navigations (boosted or `<body>` requests)
- Nothing shown for fast requests, and no blinking for borderline ones
- Automatic handling of concurrent requests
- Ignores preloaded requests (`HX-Preloaded` header)
- Themeable through `--background` / `--primary` CSS variables
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
