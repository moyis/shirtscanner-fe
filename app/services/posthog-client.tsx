import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

const token = process.env.POSTHOG_TOKEN ?? 'undefined';

export default function PostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host: "https://app.posthog.com",
    });
  }
  return posthogClient;
}

export function getDistinctId(request: Request) {
  const cookieString = request.headers.get("Cookie") || "";
  const cookieName = `ph_${token}_posthog`;
  const cookieMatch = cookieString.match(new RegExp(cookieName + "=([^;]+)"));
  let distinctId;
  if (cookieMatch) {
    const parsedValue = JSON.parse(decodeURIComponent(cookieMatch[1]));
    if (parsedValue && parsedValue.distinct_id) {
      distinctId = parsedValue.distinct_id;
    } else {
      distinctId = crypto.randomUUID();
    }
  } else {
    distinctId = crypto.randomUUID();
  }
  return distinctId;
}
