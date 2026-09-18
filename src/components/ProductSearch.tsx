import { useEffect, useState } from "react";
import { capture } from "../services/posthog-client";
import { ProductCard, type Product } from "./ProductCard";
import SearchBar from "./SearchBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";

export interface ProviderResult {
  providerName: string;
  queryUrl: string;
  products: Array<Product>;
}

export const createAccordionContent = (providerResult: ProviderResult) => {
  const foundResults = providerResult.products.length > 0;
  const text = foundResults ? (
    <>
      We found {providerResult.products.length} products matching your search
      criteria at {providerResult.providerName}. You can search in provider&apos;s
website by clicking{" "}
      <a
        className="text-kit-navy underline underline-offset-2 hover:text-stadium-ink"
        href={providerResult.queryUrl}
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>
    </>
  ) : (
    <>
      We haven&apos;t found any results for your search. This can be due to the
      search term not being found in their website or them blocking us.
      Nevertheless you can still check in their website by clicking{" "}
      <a
        className="text-kit-navy underline underline-offset-2 hover:text-stadium-ink"
        href={providerResult.queryUrl}
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>
    </>
  );
  const content = foundResults ? (
    <ScrollArea>
      {createProductCards(providerResult.products)}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ) : (
    <></>
  );
  return (
    <>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground mb-5">{text}</p>
        <div className="relative" />
      </div>
      {content}
    </>
  );
};

export const createProductCards = (products: Array<Product>) => {
  return (
    <div className="flex snap-x space-x-4 pb-4">
      {products.map((product) => (
        <ProductCard
          key={product.productLink}
          product={product}
          className="w-[150px]"
          aspectRatio="square"
          width={150}
          height={150}
        />
      ))}
    </div>
  );
};

interface ServerSearchEvent {
  total: number;
  data: ProviderResult;
}

const popularSearches = [
  { q: "Argentina", label: "Argentina shirt" },
  { q: "Barcelona", label: "Barcelona shirt" },
  { q: "Real Madrid", label: "Real Madrid shirt" },
  { q: "Basketball Jersey", label: "Basketball jerseys" },
  { q: "River Plate", label: "River Plate shirt" },
  { q: "Boca Juniors", label: "Boca Juniors shirt" },
];

export default function ProductSearch({
  backendUrl,
}: {
  backendUrl: string | undefined;
}) {
  const [q] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [total, setTotal] = useState<number>(0);
  const [providerResults, setProviderResults] = useState<Array<ProviderResult>>([]);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!backendUrl || !q) return;
    setErrored(false);
    setProviderResults([]);
    setTotal(0);
    const sse = new EventSource(`${backendUrl}/v1/products/stream?q=${q}`);
    function getRealtimeData(event: ServerSearchEvent) {
      setTotal(event.total);
      setProviderResults((currentProviderResults) => [...currentProviderResults, event.data]);
    }
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      setErrored(true);
      sse.close();
    };
    capture("search-performed", { query: q.toUpperCase() });
    return () => { sse.close(); };
  }, [backendUrl, q, retryKey]);

  const totalProducts = providerResults.length > 0 ? providerResults.flatMap((it) => it.products).length : 0;
  const progress = Math.trunc((providerResults.length * 100) / (total || 1));
  const showProgress = total > 0 && providerResults.length > 0 && progress < 100;

  if (!q) {
    return (
      <>
        <section className="relative text-center">
          <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="mx-auto flex max-w-3xl flex-col">
              <h1 className="font-display mt-1 font-black uppercase tracking-[-0.03em] text-4xl text-foreground [font-stretch:115%] lg:text-6xl">
                Search Sports Shirts
              </h1>
              <h2 className="order-first text-xl font-semibold tracking-wide text-stadium-ink">
                Millions of cheap shirts. One simple search.
              </h2>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Search every connected Chinese sports clothing store at once. Try a
              popular search to get started:
            </p>
            <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
              {popularSearches.map((item) => (
                <li key={item.q}>
                  <a
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-line bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all duration-150 hover:border-kit-navy hover:text-kit-navy active:scale-[0.98]"
                    href={`/search?q=${encodeURIComponent(item.q)}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="relative pb-8">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-24">
            <SearchBar />
          </div>
        </section>
      </>
    );
  }

  const sorted = [...providerResults].sort((a, b) =>
    a.products.length > b.products.length ? -1 : 1
  );
  const filled = sorted.filter((it) => it.products.length > 0);
  const empty = sorted.filter((it) => it.products.length === 0);

  return (
    <>
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
<div className="mx-auto flex max-w-3xl flex-col">
          <h1 className="font-display mt-1 font-black uppercase tracking-[-0.03em] text-4xl text-foreground [font-stretch:115%] lg:text-7xl">
            {q}
          </h1>
          <h2 className="order-first font-semibold tracking-wide tabular-nums text-stadium-ink">
            Found {totalProducts} results for
          </h2>
          {showProgress && <><Progress value={progress} /> <span className="text-sm tabular-nums text-muted-foreground">{progress}%</span> </>}
        </div>
        </div>
      </section>
      <section className="relative pb-8">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-24">
          <SearchBar />
        </div>
      </section>
      <div className="px-8">
        <Separator />
      </div>
      <section className="relative px-4 sm:px-8 lg:px-16">
        <Accordion type="multiple" className="w-full">
          {filled.map((providerResult) => {
            return (
              <AccordionItem
                key={providerResult.providerName}
                value={providerResult.providerName}
              >
                <AccordionTrigger className="min-h-14 py-4 text-base sm:text-lg">
                  <span className="truncate font-semibold text-foreground">
                    {providerResult.providerName}
                  </span>
                  <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-destructive px-3 py-1 text-sm font-bold tabular-nums text-destructive-foreground">
                    {providerResult.products.length}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {createAccordionContent(providerResult)}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        {empty.map((providerResult) => (
          <div
            key={providerResult.providerName}
            className="flex min-h-12 items-center justify-between gap-3 border-b border-border py-3"
          >
            <span className="truncate text-sm font-medium text-foreground">
              {providerResult.providerName}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              No results
            </span>
          </div>
        ))}
        {errored && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <p className="text-base font-semibold text-foreground">
              We couldn&apos;t reach the scanners.
            </p>
            <p className="text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:bg-volt-deep active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}
      </section>
    </>
  );
}