# HTMX Extensions

A collection of custom HTMX extensions.

## Extensions

### [@dakixr/htmx-global-indicator](./packages/global-indicator/)
A minimal HTMX extension that adds a global loading overlay and optional delayed spinner, with dark mode support.

- Loading indicator overlays only the HTMX request's target element
- Optional spinner after configurable delay (100ms default)
- Ignores preloaded requests automatically
- Respects `hx-disinherit="global-indicator"` to opt out at the element level
- Light and dark mode compatible

**Installation:**
```html
<script src="htmx.min.js"></script>
<script src="packages/global-indicator/global-indicator.js"></script>
```

**Usage:**
```html
<div hx-get="/endpoint" hx-ext="global-indicator"></div>
```

### [@dakixr/htmx-restore-history](./packages/restore-history/)
A minimal HTMX extension that enables manual history restoration.

**Installation:**
```html
<script src="htmx.min.js"></script>
<script src="packages/restore-history/restore-history.js"></script>
```

**Usage:**
```javascript
htmx.restoreHistory('/some/path');
```

## Development

All extensions are vanilla JavaScript with no build step required.

## License

MIT
