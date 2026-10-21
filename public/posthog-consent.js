/* Same-origin homepage boot. Next.js pages use the React consent component. */
(function () {
  var STORAGE_KEY = "portfolio-analytics-consent";
  var root = document.getElementById("posthog-consent");
  if (!root) return;

  var choice = null;
  try {
    choice = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    choice = null;
  }

  if (choice === "accepted") {
    initFromRoot();
    return;
  }

  if (choice === "declined") return;

  root.hidden = false;
  root.addEventListener("click", function (event) {
    var button = event.target && event.target.closest
      ? event.target.closest("[data-consent]")
      : null;
    if (!button) return;

    var next = button.getAttribute("data-consent") === "accept"
      ? "accepted"
      : "declined";

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep the page usable if storage is blocked.
    }

    root.hidden = true;
    if (next === "accepted") initFromRoot();
  });

  function initFromRoot() {
    var key = (root.getAttribute("data-posthog-key") || "").trim();
    var host = (root.getAttribute("data-posthog-host") || "").trim();
    if (!key || !host || host.indexOf("__POSTHOG_") !== -1) return;
    loadAndInit(key, host);
  }

  function loadAndInit(key, host) {
    if (window.posthog && window.posthog.__loaded) return;

    var options = {
      api_host: host,
      defaults: "2026-01-30",
      session_recording: { maskAllInputs: true },
    };

    if (window.posthog && typeof window.posthog.init === "function") {
      window.posthog.init(key, options);
      return;
    }

    /* Official PostHog array.js stub. Network starts only when init() runs. */
    /* eslint-disable */
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",r=t.getElementsByTagName("script")[0],r.parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},n="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureFlagEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),o=0;o<n.length;o++)g(u,n[o]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    /* eslint-enable */
    window.posthog.init(key, options);
  }
})();
