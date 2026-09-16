import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized) return;
  const token = import.meta.env.PUBLIC_POSTHOG_TOKEN;
  if (!token) return;
  initialized = true;
  posthog.init(token, {
    api_host: "https://app.posthog.com",
    capture_pageview: false,
  });
}

export function capture(event: string, properties?: Record<string, unknown>) {
  initPostHog();
  posthog.capture(event, properties);
}