import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PropertyCard } from "@/components/site/PropertyCard";
import { LOCATIONS, PROPERTIES, type ListingMode, type PropertyType } from "@/lib/properties";

const PAGE_SIZE = 6;

const searchSchema = z.object({
  mode: fallback(z.enum(["Buy", "Rent"]), "Buy").default("Buy"),
  q: fallback(z.string(), "").default(""),
  location: fallback(z.string(), "").default(""),
  type: fallback(z.string(), "").default(""),
  beds: fallback(z.number().int(), 0).default(0),
  baths: fallback(z.number().int(), 0).default(0),
  max: fallback(z.number().int(), 0).default(0),
  page: fallback(z.number().int().min(1), 1).default(1),
});

export const Route = createFileRoute("/properties")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Properties for Sale & Rent in Dehradun | Dehradun Properties" },
      { name: "description", content: "Filter villas, apartments and houses across Dehradun by location, budget, bedrooms and more." },
    ],
  }),
  component: PropertiesPage,
});

const TYPES: PropertyType[] = ["Apartment", "Villa", "House", "Penthouse", "Plot"];

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/properties" });
  const [showFilters, setShowFilters] = useState(false);

  const update = (patch: Record<string, unknown>) => {
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...patch, page: 1 }) as never });
  };

  const filtered = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (p.mode !== search.mode) return false;
      if (search.q) {
        const q = search.q.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.location.toLowerCase().includes(q) &&
          !p.address.toLowerCase().includes(q)
        )
          return false;
      }
      if (search.location && p.location !== search.location) return false;
      if (search.type && p.type !== search.type) return false;
      if (search.beds && p.bedrooms < search.beds) return false;
      if (search.baths && p.bathrooms < search.baths) return false;
      if (search.max && p.price > search.max) return false;
      return true;
    });
  }, [search]);

  const maxPrice = search.mode === "Rent" ? 200000 : 100000000;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((search.page - 1) * PAGE_SIZE, search.page * PAGE_SIZE);

  const clear = () =>
    navigate({
      search: { mode: search.mode, q: "", location: "", type: "", beds: 0, baths: 0, max: 0, page: 1 } as never,
    });

  return (
    <main className="container-x py-10 md:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Properties for {search.mode === "Rent" ? "Rent" : "Sale"} in Dehradun
          </h1>
          <p className="mt-2 text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "result" : "results"} matching your filters
          </p>
        </div>

        <div className="flex gap-2">
          <div className="inline-flex rounded-full bg-secondary p-1">
            {(["Buy", "Rent"] as ListingMode[]).map((m) => (
              <button
                key={m}
                onClick={() => update({ mode: m, max: 0 })}
                className={`px-5 py-2 text-sm font-medium rounded-full transition ${
                  search.mode === m
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {m === "Buy" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters((s) => !s)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* FILTERS */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } lg:block bg-card border border-border rounded-2xl p-6 h-fit sticky top-20`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={clear} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              <X className="h-3 w-3" /> Clear
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Search
              </label>
              <Input
                value={search.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Title, area, address..."
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Location
              </label>
              <select
                value={search.location}
                onChange={(e) => update({ location: e.target.value })}
                className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Any</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Property type
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => update({ type: search.type === t ? "" : t })}
                    className={`px-3 py-1.5 text-xs rounded-full border transition ${
                      search.type === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Max budget
                </label>
                <span className="text-xs font-medium text-primary">
                  {search.max
                    ? search.mode === "Rent"
                      ? `₹${search.max.toLocaleString("en-IN")}/mo`
                      : `₹${(search.max / 10000000).toFixed(2)} Cr`
                    : "Any"}
                </span>
              </div>
              <Slider
                className="mt-3"
                min={0}
                max={maxPrice}
                step={search.mode === "Rent" ? 1000 : 500000}
                value={[search.max || 0]}
                onValueChange={(v) => update({ max: v[0] })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Beds
                </label>
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => update({ beds: n })}
                      className={`flex-1 h-9 text-xs rounded-md border transition ${
                        search.beds === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {n === 0 ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Baths
                </label>
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => update({ baths: n })}
                      className={`flex-1 h-9 text-xs rounded-md border transition ${
                        search.baths === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {n === 0 ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <section>
          {pageItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center">
              <h3 className="text-lg font-semibold">No properties match your filters</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your budget or clearing some filters.
              </p>
              <Button className="mt-6" onClick={clear}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={search.page <= 1}
                onClick={() => navigate({ search: (p) => ({ ...p, page: p.page - 1 }) as never })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <Button
                    key={n}
                    size="sm"
                    variant={n === search.page ? "default" : "outline"}
                    onClick={() => navigate({ search: (p) => ({ ...p, page: n }) as never })}
                    className={n === search.page ? "bg-primary" : ""}
                  >
                    {n}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="icon"
                disabled={search.page >= totalPages}
                onClick={() => navigate({ search: (p) => ({ ...p, page: p.page + 1 }) as never })}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
