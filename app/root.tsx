import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";
import { posthog } from "posthog-js";
import { SpeedInsights } from "@vercel/speed-insights/remix";

import styles from "./tailwind.css";
import Header from "./components/header";
import { Button } from "./components/ui/button";

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

const errorPage = (error: unknown) => {
  return isRouteErrorResponse(error) ? (
    <>
      <Header />
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col">
            <h1 className="mt-1 font-extrabold uppercase tracking-tighter text-4xl lg:text-7xl">
              {error.status} - {error.statusText}
            </h1>{" "}
            <h2 className="order-first text-xl font-medium tracking-wide">
              Ups... Something went wrong
            </h2>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-l text-muted-foreground">
            {error.status === 404
              ? "We were not able to find what you're looking for"
              : "Please try again. If the error persist please contact for support"}
          </p>
        </div>
      </section>
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-24">
          <a href="/">
            <Button className="">Go back to homepage</Button>
          </a>
        </div>
      </section>
    </>
  ) : (
    <h1>Unknown Error</h1>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Ups... Something went wrong</title>
        <Meta />
        <Links />
      </head>
      <body>
        {errorPage(error)}
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async () => {
  return process.env.POSTHOG_TOKEN ?? "undefined";
};

export default function App() {
  const posthogToken: string = useLoaderData<typeof loader>();

  useEffect(() => {
    posthog.init(posthogToken, {
      api_host: "https://app.posthog.com",
      capture_pageview: false,
    });
  }, [posthogToken]);

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
        <SpeedInsights />
      </body>
    </html>
  );
}
