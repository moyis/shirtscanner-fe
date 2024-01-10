import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { useEffect } from "react";
import { posthog } from "posthog-js";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "ShirtScanner: Explore, Compare, and Find the Best Sports Clothes in China",
    },
    {
      name: "keywords",
      content:
        "Chinese sports clothes, camisetas china, remeras china, camisetas de futbol china, ShirtScanner, comparar camisetas china, China sports clothing marketplace, ShirtScanner reviews, Seamless sportswear search, Athletic fashion comparison",
    },
    {
      name: "description",
      content:
        "Explore, compare, and find your perfect sports attire with ShirtScanner. We connect you to leading Chinese retailers, offering a seamless shopping experience.",
    },
    {
      name: "name",
      content:
        "Explore, compare, and find your perfect sports attire with ShirtScanner. We connect you to leading Chinese retailers, offering a seamless shopping experience.",
    },
  ];
};

export default function App() {
  useEffect(() => {
    posthog.init("phc_sZx5YRX7ibOByVigeStL2i0VUrRamaePqRKvGob0ZFZ", {
      api_host: "https://app.posthog.com",
      capture_pageview: false,
    });
  }, []);

  const location = useLocation();
  useEffect(() => {
    posthog.capture("$pageview");
  }, [location]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
