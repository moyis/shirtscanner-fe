import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Provider {
  name: string;
  url: string;
  status: string;
}

function StatusPill({ status }: { status: string }) {
  const isUp = status.toUpperCase() === "UP";
  const isDown = status.toUpperCase() === "DOWN";
  const label = isUp ? "FIT" : isDown ? "MISSED" : "CHECKING";
  const tone = isUp
    ? "bg-noir text-pitch-white"
    : isDown
      ? "bg-volt text-volt-ink"
      : "bg-muted text-secondary-foreground";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {label}
    </span>
  );
}

export default function ProviderTable({
  backendUrl,
}: {
  backendUrl: string | undefined;
}) {
  const [providers, setProviders] = useState<Array<Provider>>([]);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!backendUrl) return;
    setErrored(false);
    fetch(`${backendUrl}/v1/providers`)
      .then((r) => r.json())
      .then((data) => {
        setProviders(data);
        setErrored(false);
      })
      .catch(() => {
        setProviders([]);
        setErrored(true);
      });
  }, [backendUrl, retryKey]);

  const isEmpty = !errored && providers.length === 0;

  return (
    <>
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col">
            <h1 className="font-display mt-1 font-black uppercase tracking-[-0.03em] text-4xl text-foreground [font-stretch:115%] lg:text-7xl">
              All our <span className="tabular-nums">{providers.length}</span> providers
            </h1>{" "}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We search your shirts in all of them at the same time
          </p>
        </div>
      </section>
      <section className="h-full flex-1 flex-col p-4 sm:p-8 md:flex">
        <div className="space-y-3 md:hidden">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="truncate font-semibold text-foreground">
                  {provider.name}
                </span>
                <StatusPill status={provider.status} />
              </div>
              <a
                className="mt-1.5 block break-all text-sm text-kit-navy underline underline-offset-2 hover:text-stadium-ink"
                href={provider.url}
                target="_blank"
                rel="noreferrer"
              >
                {provider.url}
              </a>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <TooltipProvider delayDuration={300}>
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
                    <TableCell className="font-medium text-foreground">
                      {provider.name}
                    </TableCell>
                    <TableCell>
                      <a
                        className="text-kit-navy underline underline-offset-2 hover:text-stadium-ink"
                        href={provider.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {provider.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={provider.url}
                              target="_blank"
                              rel="noreferrer"
                              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <StatusPill status={provider.status} />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Integration with{" "}
                              <a
                                className="text-foreground underline underline-offset-2"
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      </section>
      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="text-base font-semibold text-foreground">
            No providers connected yet.
          </p>
          <p className="text-sm text-muted-foreground">Check back soon.</p>
        </div>
      )}
      {errored && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="text-base font-semibold text-foreground">
            We couldn&apos;t load the providers.
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
    </>
  );
}