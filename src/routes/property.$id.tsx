import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Calendar,
  Check,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyCard } from "@/components/site/PropertyCard";
import { formatINR, getProperty, similarProperties } from "@/lib/properties";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.property.title} — Dehradun Properties` },
            { name: "description", content: loaderData.property.description.slice(0, 160) },
            { property: "og:title", content: loaderData.property.title },
            { property: "og:description", content: loaderData.property.description.slice(0, 160) },
            { property: "og:image", content: loaderData.property.images[0] },
            { name: "twitter:image", content: loaderData.property.images[0] },
          ],
        }
      : {},
  notFoundComponent: () => (
    <main className="container-x py-24 text-center">
      <h1 className="text-3xl font-semibold">Property not found</h1>
      <p className="mt-2 text-muted-foreground">It may have been sold or delisted.</p>
      <Link to="/properties" className="mt-6 inline-block">
        <Button>Browse properties</Button>
      </Link>
    </main>
  ),
  errorComponent: () => (
    <main className="container-x py-24 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <Link to="/properties" className="mt-6 inline-block">
        <Button>Back to listings</Button>
      </Link>
    </main>
  ),
  component: PropertyDetail,
});

const visitSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(/^[+\d\s-]{7,16}$/, "Enter a valid phone"),
  date: z.string().min(1, "Pick a date"),
  message: z.string().max(500).optional(),
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", message: "" });

  const similar = similarProperties(property);
  const mapsQuery = encodeURIComponent(`${property.address}, Dehradun`);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = visitSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    toast.success("Visit request sent! Our agent will reach out shortly.");
    setForm({ name: "", phone: "", date: "", message: "" });
  };

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in "${property.title}" (${property.id}) listed on Dehradun Properties.`,
  );

  return (
    <main className="container-x py-8 md:py-12">
      <Link
        to="/properties"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      {/* GALLERY */}
      <section className="mt-6 grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
          <img
            src={property.images[active]}
            alt={property.title}
            className="h-full w-full object-cover"
            width={1280}
            height={896}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              For {property.mode}
            </span>
            <span className="rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium">
              {property.type}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
          {property.images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-xl ring-2 transition ${
                active === i ? "ring-primary" : "ring-transparent hover:ring-primary/40"
              }`}
            >
              <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">{property.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {property.address}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSaved((s) => !s);
                  toast(saved ? "Removed from saved" : "Saved to wishlist");
                }}
              >
                <Heart className={saved ? "fill-primary text-primary" : ""} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied");
                }}
              >
                <Share2 />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-3xl font-semibold text-primary">
            {formatINR(property.price, property.mode)}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-5">
            <Stat icon={<BedDouble />} label="Bedrooms" value={property.bedrooms} />
            <Stat icon={<Bath />} label="Bathrooms" value={property.bathrooms} />
            <Stat icon={<Maximize2 />} label="Area" value={`${property.area} ft²`} />
          </div>

          <Section title="About this property">
            <p className="text-foreground/85 leading-relaxed">{property.description}</p>
          </Section>

          <Section title="Amenities">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2.5 text-sm"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Location">
            <div className="overflow-hidden rounded-2xl border border-border aspect-[16/9]">
              <iframe
                title="Map"
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Section>

          <Section title="Nearby">
            <div className="flex flex-wrap gap-2">
              {property.nearby.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
                >
                  {n}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 lg:sticky lg:top-20 h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">
                {property.agent.name.split(" ").map((s) => s[0]).join("")}
              </div>
              <div>
                <div className="font-semibold">{property.agent.name}</div>
                <div className="text-xs text-muted-foreground">Listing Agent · Dehradun</div>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              <a href={`tel:${property.agent.phone.replace(/\s/g, "")}`}>
                <Button variant="outline" className="w-full">
                  <Phone /> {property.agent.phone}
                </Button>
              </a>
              <a
                href={`https://wa.me/${property.agent.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-full bg-[oklch(0.6_0.17_152)] hover:bg-[oklch(0.55_0.17_152)] text-white">
                  <MessageCircle /> WhatsApp Enquiry
                </Button>
              </a>
            </div>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Schedule a visit
            </h3>
            <div className="mt-4 space-y-3">
              <Input
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={80}
              />
              <Input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={16}
              />
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
              <Textarea
                placeholder="Any preferences? (optional)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={500}
                rows={3}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Request visit
              </Button>
            </div>
          </form>
        </aside>
      </section>

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-semibold">Similar properties</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary [&_svg]:size-5">
        {icon}
      </div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}
