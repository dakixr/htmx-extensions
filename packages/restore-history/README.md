# htmx-restore-history

A minimal HTMX extension that enables manual history restoration.

## Installation

```html
<script src="htmx.min.js"></script>
<script src="restore-history.js"></script>
```

## Usage

This extension adds a `htmx.restoreHistory(path)` function that allows you to programmatically trigger history navigation:

```javascript
// Navigate to a path and update history
htmx.restoreHistory('/some/path');
```

This is useful when you need to:
- Trigger htmx history restoration from custom JavaScript
- Manually push to history and have htmx handle the restoration
- Integrate with custom navigation logic

## How It Works

1. Pushes the target URL into browser history using `history.pushState()`
2. Dispatches a `popstate` event that htmx listens to
3. htmx's standard history restoration mechanism takes over

## License

MIT
