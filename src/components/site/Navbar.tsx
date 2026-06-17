import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, MountainSnow, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties", search: { mode: "Buy" as const } },
  { to: "/properties", label: "Rent", search: { mode: "Rent" as const } },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <MountainSnow className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Dehradun <span className="text-primary">Properties</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search as never}
              className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-accent/60 transition-colors"
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="#contact"
            className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-accent/60 transition-colors"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/properties" className="hidden sm:inline-flex">
            <Button className="bg-primary hover:bg-primary/90">List Property</Button>
          </Link>
          <button
            className="md:hidden grid place-items-center h-10 w-10 rounded-md border border-border"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-x py-3 flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search as never}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-border/60"
              >
                {item.label}
              </Link>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="py-3 text-sm font-medium">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
