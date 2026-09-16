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
        className="underline"
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
        className="underline"
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
    <div className="flex space-x-4 pb-4">
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

  useEffect(() => {
    if (!backendUrl || !q) return;
    const sse = new EventSource(`${backendUrl}/v1/products/stream?q=${q}`);
    function getRealtimeData(event: ServerSearchEvent) {
      setTotal(event.total);
      setProviderResults((currentProviderResults) => [...currentProviderResults, event.data]);
    }
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => { sse.close(); };
    capture("search-performed", { query: q.toUpperCase() });
    return () => { sse.close(); };
  }, [backendUrl, q]);

  const totalProducts = providerResults.length > 0 ? providerResults.flatMap((it) => it.products).length : 0;
  const progress = Math.trunc((providerResults.length * 100) / (total || 1));
  return (
    <>
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
          <div className="mx-auto flex max-w-3xl flex-col">
            <h1 className="mt-1 font-bold uppercase tracking-tighter text-4xl lg:text-7xl">
              {q}
            </h1>
            <h2 className="order-first font-medium tracking-wide">
              Found {totalProducts} results for
            </h2>
            {progress < 100 ? (<><Progress value={progress} /> {progress}% </>) : (<></>)}
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
      <section className="relative px-16">
        <Accordion type="multiple" className="w-full">
          {providerResults.filter((provider) => provider.products.length > 0).sort((a, b) => (a.products.length > b.products.length) ? -1 : 1).map((providerResult) => {
            return (
              <AccordionItem
                key={providerResult.providerName}
                value={providerResult.providerName}
              >
                <AccordionTrigger>
                  {providerResult.providerName} - Found{" "}
                  {providerResult.products.length} products
                </AccordionTrigger>
                <AccordionContent>
                  {createAccordionContent(providerResult)}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
    </>
  );
}