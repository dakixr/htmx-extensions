htmx.defineExtension("manualHistory", {
  init: function(api) {
    htmx.restoreHistory = function(path) {
      // Push the target URL into history so location updates.
      history.pushState({ htmx: true }, '', path);
      // Dispatch a popstate event—htmx's onpopstate handler will pick this up.
      window.dispatchEvent(new PopStateEvent('popstate', { state: { htmx: true } }));
    };
  }
});