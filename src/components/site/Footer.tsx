import { Link } from "@tanstack/react-router";
import { MountainSnow, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="mt-24 bg-primary text-primary-foreground">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-foreground/10">
              <MountainSnow className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">Dehradun Properties</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/75 leading-relaxed">
            Curated homes, villas and apartments across the Doon Valley.
            Honest pricing, verified listings, and a team that knows every lane
            from Rajpur Road to Mussoorie Road.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary-foreground">Home</Link></li>
            <li><Link to="/properties" className="hover:text-primary-foreground">All Properties</Link></li>
            <li><Link to="/properties" search={{ mode: "Rent" } as never} className="hover:text-primary-foreground">For Rent</Link></li>
            <li><Link to="/properties" search={{ mode: "Buy" } as never} className="hover:text-primary-foreground">For Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>2nd Floor, Rajpur Road</li>
            <li>Dehradun, Uttarakhand 248001</li>
            <li>+91 98765 43210</li>
            <li>hello@dehradunproperties.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-x py-5 text-xs text-primary-foreground/60 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Dehradun Properties. All rights reserved.</span>
          <span>Built with love in the Doon Valley.</span>
        </div>
      </div>
    </footer>
  );
}
