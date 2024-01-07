import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 text-m font-medium bg-white border-b">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 md:hidden w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <a href="/" className="block px-2 py-1 text-lg">Home</a>
                <a href="https://www.linkedin.com/in/fausto-moya/" className="block px-2 py-1 text-lg">About Me</a>
              </nav>
            </SheetContent>
          </Sheet>
          <a href="/" className="ml-4 lg:ml-0">
            <span className="mt-1 font-extrabold uppercase tracking-tighter sm:text-xl lg:text-l">SHIRTSCANNER</span>
          </a>
        </div>
        <nav className="mx-6 items-center space-x-4 lg:space-x-6 hidden md:block">
            <a href="/" className="text-sm font-medium transition-colors">Home</a>
            <a href="https://www.linkedin.com/in/fausto-moya/" className="text-sm font-medium transition-colors">About Me</a>
        </nav>
      </div>
  </header>
  );
}

/* old nav
<nav className="sticky top-0 z-50 text-m font-medium bg-white">
      <div className="border-b">
      <div className="flex items-center justify-between h-16 max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <a href="/" className="mt-1 font-extrabold uppercase tracking-tighter sm:text-xl lg:text-l">ShirtScanner</a>
      <div className="hidden sm:flex sm:items-center sm:gap-4 lg:gap-8">
      <a href="/">Home</a>
      <a href="https://www.linkedin.com/in/fausto-moya/">About Me</a>
      </div> 
      </div>
      </div>
    </nav>
    */
