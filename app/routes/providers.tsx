import { useLoaderData, type LoaderFunction } from "react-router";
import Header from "~/components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { JSX } from "react";

export function meta() {
  return [
    { title: "Discover Top Sports Clothing Providers" },
    {
      name: "description",
      content:
        "Explore a curated selection of premium sports clothing from our network of connected providers. Find the latest shirts, jerseys, hoodies, and more, all in one convenient place. Elevate your athletic style with our diverse range of offerings. Shop confidently, knowing you have access to the best in sports fashion from trusted providers. Start browsing now for a seamless and enjoyable shopping experience.",
    },
  ];
};

interface Provider {
  name: string;
  url: string;
  status: string;
}

export const loader: LoaderFunction = async () => {
  return await fetch(`${process.env.SHIRTSCANNER_BE}/v1/providers`);
};

const getStatusEmoji = (provider: Provider): JSX.Element => {
  switch (provider.status.toUpperCase()) {
    case "UP":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 0h24v24H0z" stroke="none" />
          <path d="M6 9a6 6 0 1 0 12 0A6 6 0 0 0 6 9" />
          <path d="M12 3c1.333.333 2 2.333 2 6s-.667 5.667-2 6M12 3c-1.333.333-2 2.333-2 6s.667 5.667 2 6M6 9h12M3 20h7M14 20h7M10 20a2 2 0 1 0 4 0 2 2 0 0 0-4 0M12 15v3" />
        </svg>
      );
    case "DOWN":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 0h24v24H0z" stroke="none" />
          <path d="M6.528 6.536a6 6 0 0 0 7.942 7.933m2.247-1.76A6 6 0 0 0 8.29 4.284" />
          <path d="M12 3c1.333.333 2 2.333 2 6 0 .337-.006.66-.017.968m-.55 3.473c-.333.884-.81 1.403-1.433 1.559M12 3c-.936.234-1.544 1.29-1.822 3.167m-.16 3.838C10.134 13.034 10.794 14.7 12 15M6 9h3m4 0h5M3 20h7M14 20h7M10 20a2 2 0 1 0 4 0 2 2 0 0 0-4 0M12 15v3M3 3l18 18" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 0h24v24H0z" stroke="none" />
          <path d="M17 22v-2M9 15l6-6M11 6l.463-.536a5 5 0 0 1 7.071 7.072L18 13M13 18l-.397.534a5.068 5.068 0 0 1-7.127 0 4.972 4.972 0 0 1 0-7.071L6 11M20 17h2M2 7h2M7 2v2" />
        </svg>
      );
  }
};

export default function Index() {
  const providers: Array<Provider> = useLoaderData<typeof loader>();
  console.log(providers)
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
              <TableHead className="text-center">Status</TableHead>
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
                <TableCell className="flex items-center justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {getStatusEmoji(provider)}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Integration with{" "}
                          <a
                            className="underline"
                            href={provider.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {provider.url}
                          </a>{" "}
                          is{" "}
                          {provider.status
                            ? provider.status.toLowerCase()
                            : "unknown"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
