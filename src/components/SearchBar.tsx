export default function SearchBar() {
  return (
    <form method="get" action="/search">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
          <svg
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          name="q"
          type="search"
          id="default-search"
          aria-label="Search for shirts"
          className="h-14 w-full rounded-lg border border-input bg-background ps-10 pe-28 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Find your next shirt..."
          required
        />
        <button
          type="submit"
          className="absolute end-1.5 bottom-1.5 top-1.5 min-w-[88px] rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:bg-volt-deep active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Search
        </button>
      </div>
    </form>
  );
}