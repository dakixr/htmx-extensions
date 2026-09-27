(function () {
  // Timings (ms). Override any of them with htmx.config.globalIndicator, e.g.
  // <meta name="htmx-config" content='{"globalIndicator":{"spinnerDelay":800}}'>
  const defaults = {
    dimDelay: 200, // before a local target is dimmed
    spinnerDelay: 1000, // before a spinner joins the dim
    minVisible: 300, // how long a dim stays once shown, so it never blinks
    barDelay: 150, // before the top progress bar appears for page navigations
    bar: true, // set to false when the page already has its own progress bar
  };

  const localEntries = new Map(); // target element -> entry
  let globalEntry = null;
  let globalBar = null;

  function settings() {
    return Object.assign({}, defaults, htmx.config.globalIndicator);
  }

  const xhrToEntry = new WeakMap();

  htmx.defineExtension("global-indicator", {
    onEvent: function (name, evt) {
      if (name === "htmx:beforeRequest") {
        begin(evt);
      } else if (
        name === "htmx:afterRequest" ||
        name === "htmx:sendError" ||
        name === "htmx:timeout" ||
        name === "htmx:abort"
      ) {
        // Several of these can fire for one request; the WeakMap makes it count once.
        const entry = xhrToEntry.get(evt.detail.xhr);
        if (!entry) return;
        xhrToEntry.delete(evt.detail.xhr);
        end(entry);
      } else if (name === "htmx:beforeHistorySave" || name === "htmx:historyRestore") {
        // Keep overlays out of history snapshots and restored pages.
        clearAll();
      }
    },
  });

  function begin(evt) {
    const detail = evt.detail;
    if (detail.requestConfig?.headers?.["HX-Preloaded"] === "true") return;
    if (detail.elt.matches('[hx-disinherit~="global-indicator"]')) return;

    const target = detail.target;
    const isBody = target === document.body;
    const isBoosted = detail.boosted === true || detail.elt.hasAttribute("hx-boost");
    let entry = null;
    if (isBody || isBoosted) {
      if (settings().bar) entry = beginGlobal();
    } else if (target instanceof Element) {
      entry = beginLocal(target);
    }
    if (entry) xhrToEntry.set(detail.xhr, entry);
  }

  // --- LOCAL: dim the swap target ---

  function beginLocal(target) {
    let entry = localEntries.get(target);
    if (entry) {
      // A request is already running (or its dim is lingering): reuse it.
      entry.count++;
      clearTimeout(entry.hideTimer);
      entry.hideTimer = null;
      return entry;
    }

    const config = settings();
    entry = {
      isGlobal: false,
      target: target,
      count: 1,
      shownAt: null,
      dimTimer: null,
      spinnerTimer: null,
      hideTimer: null,
      overlay: document.createElement("div"),
      positioned: false,
    };
    localEntries.set(target, entry);

    // The overlay goes in right away but stays transparent: it blocks double
    // clicks immediately and only becomes visible if the request is slow.
    entry.overlay.className = "htmx-local-overlay";
    if (getComputedStyle(target).position === "static") {
      target.classList.add("htmx-loading");
      entry.positioned = true;
    }
    target.setAttribute("aria-busy", "true");
    target.appendChild(entry.overlay);

    entry.dimTimer = setTimeout(function () {
      entry.overlay.classList.add("is-visible");
      entry.shownAt = performance.now();
    }, config.dimDelay);
    entry.spinnerTimer = setTimeout(function () {
      const spinner = document.createElement("div");
      spinner.className = "htmx-local-spinner";
      entry.overlay.appendChild(spinner);
    }, config.spinnerDelay);
    return entry;
  }

  function teardownLocal(entry) {
    clearTimeout(entry.dimTimer);
    clearTimeout(entry.spinnerTimer);
    clearTimeout(entry.hideTimer);
    entry.overlay.remove();
    if (entry.positioned) entry.target.classList.remove("htmx-loading");
    entry.target.removeAttribute("aria-busy");
    localEntries.delete(entry.target);
  }

  // --- GLOBAL: top progress bar for page navigations ---

  function beginGlobal() {
    if (globalEntry) {
      globalEntry.count++;
      return globalEntry;
    }
    globalEntry = { isGlobal: true, count: 1, barTimer: null, shown: false };
    const entry = globalEntry;
    entry.barTimer = setTimeout(function () {
      entry.shown = true;
      showBar();
    }, settings().barDelay);
    return entry;
  }

  function showBar() {
    if (!globalBar) {
      globalBar = document.createElement("div");
      globalBar.className = "htmx-global-bar";
      globalBar.setAttribute("aria-hidden", "true");
    }
    // Attach to <html> so body swaps cannot remove the bar mid-request.
    if (!globalBar.isConnected) document.documentElement.appendChild(globalBar);
    globalBar.classList.remove("is-loading", "is-done");
    void globalBar.offsetWidth; // restart the trickle from zero
    globalBar.classList.add("is-loading");
  }

  function teardownGlobal(entry) {
    clearTimeout(entry.barTimer);
    if (entry.shown && globalBar) {
      globalBar.classList.remove("is-loading");
      globalBar.classList.add("is-done");
    }
    if (globalEntry === entry) globalEntry = null;
  }

  // --- SHARED ---

  function end(entry) {
    entry.count--;
    if (entry.count > 0) return;
    if (entry.isGlobal) {
      teardownGlobal(entry);
      return;
    }

    clearTimeout(entry.dimTimer);
    clearTimeout(entry.spinnerTimer);
    const remaining =
      entry.shownAt === null ? 0 : settings().minVisible - (performance.now() - entry.shownAt);
    // If the swap already removed the overlay there is nothing left to hold.
    if (remaining > 0 && entry.overlay.isConnected) {
      entry.hideTimer = setTimeout(function () {
        teardownLocal(entry);
      }, remaining);
    } else {
      teardownLocal(entry);
    }
  }

  function clearAll() {
    Array.from(localEntries.values()).forEach(teardownLocal);
    if (globalEntry) teardownGlobal(globalEntry);
  }

  // --- STYLES ---
  const style = document.createElement("style");
  style.textContent = `
    .htmx-loading { position: relative; }
    .htmx-local-overlay {
      position: absolute;
      inset: 0;
      z-index: 99998;
      display: grid;
      place-items: center;
      border-radius: inherit;
      background: color-mix(in oklab, var(--background, #fff) 55%, transparent);
      cursor: progress;
      opacity: 0;
      transition: opacity 150ms ease-out;
    }
    .dark .htmx-local-overlay {
      background: color-mix(in oklab, var(--background, oklch(0.145 0 0)) 55%, transparent);
    }
    .htmx-local-overlay.is-visible { opacity: 1; }
    .htmx-local-spinner {
      width: min(2rem, 60%);
      aspect-ratio: 1;
      border: 3px solid;
      border-color: var(--primary, #2563eb) transparent var(--primary, #2563eb) transparent;
      border-radius: 50%;
      pointer-events: none;
      animation: htmx-gi-spin 0.7s ease-in-out infinite, htmx-gi-fade-in 150ms ease-out;
    }
    .htmx-global-bar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100000;
      width: 0;
      height: 3px;
      background: var(--primary, #2563eb);
      opacity: 0;
      pointer-events: none;
    }
    /* Fast at first, then slows down, never reaching the end on its own. */
    .htmx-global-bar.is-loading {
      width: 90%;
      opacity: 1;
      transition: width 10s cubic-bezier(0.1, 0.7, 0.2, 1);
    }
    .htmx-global-bar.is-done {
      width: 100%;
      opacity: 0;
      transition: width 200ms ease-out, opacity 200ms ease 200ms;
    }
    @keyframes htmx-gi-spin { to { transform: rotate(360deg); } }
    @keyframes htmx-gi-fade-in { from { opacity: 0; } }
  `;
  document.head.appendChild(style);
})();
