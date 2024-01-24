import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export const meta: MetaFunction = () => {
  return [
    { title: "Discover Top Sports Clothing Providers" },
    {
      name: "description",
      content:
        "Explore a curated selection of premium sports clothing from our network of connected providers. Find the latest shirts, jerseys, hoodies, and more, all in one convenient place. Elevate your athletic style with our diverse range of offerings. Shop confidently, knowing you have access to the best in sports fashion from trusted providers. Start browsing now for a seamless and enjoyable shopping experience.",
    },
  ];
};

export const loader = async () => {
  return await fetch(`${process.env.SHIRTSCANNER_BE}/v1/providers`);
};

interface Provider {
  name: string;
  url: string;
}

export default function Index() {
  const providers: Array<Provider> = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col">
            <h1 className="mt-1 font-bold tracking-tighter text-4xl lg:text-7xl">
              All our {providers.length} providers
            </h1>{" "}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
            We search your shirts in all of them at the same time
          </p>
        </div>
      </section>
      <section className="h-full flex-1 flex-col p-8 md:flex">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">Name</TableHead>
              <TableHead className="text-center">Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.name} className="text-center">
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>
                  <a
                    className="underline"
                    href={provider.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    {provider.url}{" "}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
