# htmx-global-indicator

**A minimal HTMX extension that shows loading feedback only when a request is actually slow.**

---

## Overview

htmx-global-indicator gives HTMX requests loading feedback without the flash you get when an overlay appears and vanishes on fast requests.

- **Partial swaps** dim *only the request's target element*, after a short delay, and add a spinner if the request keeps going.
- **Page navigations** (boosted requests or requests targeting `<body>`) show a thin progress bar at the top of the page instead of covering it.
- Requests that finish before the delays show nothing at all.
- Pure vanilla JS, no dependencies, no build step.

## Features

- Target dim after `200ms`, spinner after `1000ms`.
- Once the dim is visible it stays for at least `300ms`, so it never blinks.
- Top progress bar after `150ms` for page navigations.
- Clicks on the target are blocked immediately (no double submits) without any visible change.
- Sets `aria-busy="true"` on the target while loading.
- Handles concurrent requests on the same target.
- Ignores preloaded (`HX-Preloaded`) requests automatically.
- Respects `hx-disinherit="global-indicator"` to opt out at the element level.
- Follows your theme through the `--background` and `--primary` CSS variables, with light and `.dark` fallbacks.

**Demo**:
[Demo](./demo.gif)

## Installation

```html
<script src="htmx.min.js"></script>
<script src="global-indicator.js"></script>
```

## Usage

Add the extension to the elements you want:

```html
<div hx-get="/endpoint" hx-ext="global-indicator"></div>
```

If you want to opt out of the global indicator on child elements:

```html
<div hx-get="/endpoint" hx-ext="global-indicator">
  <div hx-get="/other-endpoint" hx-disinherit="global-indicator">This child will not show the indicator</div>
</div>
```

## Configuration

Override any setting through `htmx.config.globalIndicator`, for example with the htmx config meta tag:

```html
<meta name="htmx-config" content='{"globalIndicator":{"spinnerDelay":800,"bar":false}}'>
```

| Setting        | Default | Description                                                  |
| -------------- | ------- | ------------------------------------------------------------ |
| `dimDelay`     | `200`   | ms before the target is dimmed                               |
| `spinnerDelay` | `1000`  | ms before a spinner is added to the dim                      |
| `minVisible`   | `300`   | minimum ms the dim stays once it has appeared                |
| `barDelay`     | `150`   | ms before the top progress bar appears for page navigations  |
| `bar`          | `true`  | set to `false` if your page already has its own progress bar |

Restyle it by overriding the `.htmx-local-overlay`, `.htmx-local-spinner` and `.htmx-global-bar` classes.

## How It Works

- On `htmx:beforeRequest`, a transparent `.htmx-local-overlay` is added to the **target**.
- After `dimDelay`, the overlay gets `.is-visible` and fades in; after `spinnerDelay`, a `.htmx-local-spinner` is added to it.
- When the request finishes, the overlay is removed, after waiting out `minVisible` if it was visible.
- For page navigations, `.htmx-global-bar` (attached to `<html>` so body swaps do not remove it) creeps towards 90% while loading, then completes and fades out.

## Feedback

Feedback, criticism, suggestions — all welcome!

## Development

No build step needed. Vanilla JS.

## License

MIT
