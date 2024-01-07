import Header from "~/components/header";
import { Input } from "~/components/ui/input";

export default function Index() {
  return (
    <>
      <Header />
      <section className="relative text-center">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col">
            <h1 className="mt-1 font-extrabold uppercase tracking-tighter sm:text-5xl lg:text-7xl">
              ShirtScanner
            </h1>{" "}
            <h2 className="order-first text-xl font-medium tracking-wide">
              Millions of cheap shirts. One simple search.
            </h2>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-l text-muted-foreground">
            Explore, Compare, and Find the Best Sports Clothes in China
          </p>
          <div>
            <form method="get" action="/search">
              <div className="flex pt-10 px-48 w-full">
                <Input
                  name="q"
                  type="text"
                  placeholder="Find your favourite team..."
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
