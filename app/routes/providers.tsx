import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  return await fetch("http://localhost:8080/v1/providers");
};

interface Provider {
  name: string;
  website: string;
}


export default function Index() {
  const providers: Array<Provider> = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col">
            <h1 className="mt-1 font-bold tracking-tighter sm:text-5xl lg:text-7xl">
              All our providers
            </h1>{" "}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
          We're constantly adding new providers. So keep an eye 
          </p>
        </div>
      </section>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.name}>
              <TableCell className="font-medium">{provider.name}</TableCell>
              <TableCell><a className="underline" href={provider.website} target="_blank" rel="noreferrer"> {provider.website} </a></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <Footer />
    </>
  );
}
