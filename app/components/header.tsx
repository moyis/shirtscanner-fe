export default function Header() {
  return (
    <div className="sticky top-0 z-50 text-m font-medium bg-white">
      <div className="border-b">
      <div className="flex items-center justify-between h-16 max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <a href="/" className="mt-1 font-extrabold uppercase tracking-tighter sm:text-xl lg:text-l">ShirtScanner</a>
      <nav className="hidden sm:flex sm:items-center sm:gap-4 lg:gap-8">
      <a href="/">Home</a>
      <a href="https://www.linkedin.com/in/fausto-moya/">About Me</a>
      </nav> 
      </div>
      </div>
    </div>
  );
}
