import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import posthog from "posthog-js";
import Header from "~/components/header";
import { ProductCard } from "~/components/product-card";
import SearchBar from "~/components/search-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export interface Product {
  name: string;
  price: string;
  productLink: string;
  imageLink: string;
}
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
      criteria at {providerResult.providerName}. You can search in provider's
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
      We haven't found any results for your search. This can be due to the
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
          key={product.name}
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

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) return json([]);
  const response = await fetch(
    `${process.env.SHIRTSCANNER_BE}/v1/products?q=${q}`
  );
  posthog.capture("search", {
    query: q,
    response: response,
  });

  return response;
}

export default function Index() {
  const providerResults: Array<ProviderResult> = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  return (
    <>
      <Header />
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
          <div className="mx-auto flex max-w-3xl flex-col">
            <h1 className="mt-1 font-bold uppercase tracking-tighter sm:text-5xl lg:text-7xl">
              {searchParams.get("q")}
            </h1>{" "}
            <h2 className="order-first font-medium tracking-wide">
              Found {providerResults.flatMap((it) => it.products).length} results for
            </h2>
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
          {providerResults.map((providerResult) => {
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
