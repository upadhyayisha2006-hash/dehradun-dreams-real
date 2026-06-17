import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatINR, type Property } from "@/lib/properties";

export function PropertyCard({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          width={1280}
          height={896}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
            For {property.mode}
          </span>
          <span className="rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-foreground">
            {property.type}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved((s) => !s);
            toast(saved ? "Removed from saved" : "Saved to wishlist");
          }}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur hover:bg-background transition"
          aria-label="Save property"
        >
          <Heart
            className={`h-4 w-4 transition ${
              saved ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="text-xl font-semibold text-primary">
            {formatINR(property.price, property.mode)}
          </div>
          <h3 className="mt-1 line-clamp-1 text-base font-semibold text-foreground">
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{property.address}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 pt-3 mt-auto border-t border-border text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 className="h-4 w-4" /> {property.area} ft²
          </span>
        </div>

        <Link
          to="/property/$id"
          params={{ id: property.id }}
          className="absolute inset-0"
          aria-label={`View ${property.title}`}
        />
        <div className="relative z-10 pt-1">
          <Link to="/property/$id" params={{ id: property.id }}>
            <Button variant="outline" className="w-full border-primary/30 hover:bg-primary hover:text-primary-foreground">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
