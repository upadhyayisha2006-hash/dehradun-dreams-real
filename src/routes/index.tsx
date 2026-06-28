import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, MapPin, Search, Sparkles, Star, TrendingUp, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/site/PropertyCard";
import { LOCATIONS, PROPERTIES } from "@/lib/properties";
import { submitContact } from "@/lib/supabase";
import heroImg from "@/assets/hero-dehradun.jpg";
import companyAboutImg from "@/assets/company-about.png";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dehradun Dreams Real — Find Your Dream Home in the Doon Valley" },
      {
        name: "description",
        content: "Browse verified villas, apartments and houses across Rajpur Road, Mussoorie Road, Sahastradhara and more in Dehradun.",
      },
      { property: "og:title", content: "Dehradun Dreams Real" },
      { property: "og:description", content: "Find your dream property in Dehradun." },
    ],
  }),
  component: HomePage,
});

const TESTIMONIALS = [
  {
    name: "Ananya Verma",
    role: "Bought a villa on Mussoorie Road",
    quote:
      "The team understood exactly what we wanted — hillside, quiet, with a garden. We closed in under a month.",
  },
  {
    name: "Rohit Singh",
    role: "Rented in Rajpur Greens",
    quote:
      "Listings were honest and photos matched reality. Best property experience I've had in Dehradun.",
  },
  {
    name: "Meera Joshi",
    role: "Sold ancestral home in Ballupur",
    quote:
      "Professional, patient, and got us 12% above our expected price. Highly recommended.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<string>("");
  
  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featured = PROPERTIES.filter((p) => p.featured).slice(0, 6);

  const goSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/properties",
      search: { q: query || undefined, location: location || undefined } as never,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContact(contactName, contactEmail, contactPhone, contactMessage);
      toast.success("Thank you! Your message has been submitted. We will contact you shortly.");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMessage("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Luxury villa in Dehradun with Himalayan view"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        </div>

        <div className="container-x pt-24 pb-32 md:pt-32 md:pb-44 text-white">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium ring-1 ring-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 5,000+ Doon Valley families
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05]">
              Find Your Dream Property in <span className="text-gradient-brand">Dehradun</span>
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-white/85">
              Hand-picked villas, modern apartments and quiet hillside homes —
              across every neighbourhood in the Doon Valley.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/properties">
                <Button size="lg" className="h-12 px-7 bg-primary hover:bg-primary-glow text-base">
                  Explore Properties <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#featured">
                <Button size="lg" variant="outline" className="h-12 px-7 bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20 hover:text-white text-base">
                  Featured Homes
                </Button>
              </a>
            </div>

            {/* SEARCH BAR */}
            <form
              onSubmit={goSearch}
              className="mt-10 grid gap-2 md:grid-cols-[1fr_220px_auto] rounded-2xl bg-background/95 backdrop-blur p-3 shadow-glow ring-1 ring-white/10"
            >
              <div className="flex items-center gap-2 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search villas, 3BHK, Rajpur..."
                  className="border-0 shadow-none focus-visible:ring-0 px-0 h-11 text-foreground"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-t md:border-t-0 md:border-l border-border">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11 w-full bg-transparent text-sm text-foreground focus:outline-none"
                >
                  <option value="">Any location</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 bg-primary hover:bg-primary/90">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="container-x -mt-12 md:-mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-border shadow-elegant">
          {[
            { v: "1,200+", l: "Active Listings" },
            { v: "180+", l: "Verified Agents" },
            { v: "₹450 Cr", l: "Closed in 2026" },
            { v: "4.9★", l: "Avg Client Rating" },
          ].map((s) => (
            <div key={s.l} className="bg-card p-6 text-center">
              <div className="text-2xl md:text-3xl font-semibold text-primary">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="container-x mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Featured</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold">
              Properties picked for you this week
            </h2>
          </div>
          <Link to="/properties" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-glow">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* POPULAR LOCATIONS */}
      <section className="container-x mt-28">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Neighbourhoods</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Popular locations in Dehradun</h2>
          <p className="mt-3 text-muted-foreground">
            From the leafy quiet of Rajpur Road to the breezy hillsides of Mussoorie Road — explore homes by neighbourhood.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc, i) => {
            const count = PROPERTIES.filter((p) => p.location === loc).length;
            return (
              <Link
                key={loc}
                to="/properties"
                search={{ location: loc } as never}
                className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-secondary p-6 hover:shadow-elegant transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{loc}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {count} {count === 1 ? "property" : "properties"}
                    </p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Trending in {2026 - (i % 3)}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* COMPANY DETAILS - ABOUT US */}
      <section className="container-x mt-28">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative group overflow-hidden rounded-3xl shadow-glow">
            <img
              src={companyAboutImg}
              alt="Dehradun Dreams Real Luxury Office"
              className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">About Our Company</span>
            <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Dehradun <span className="text-gradient-brand">Dreams Real</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Founded in the heart of the Doon Valley, Dehradun Dreams Real is a premier real estate advisory firm dedicated to matching buyers with their perfect hillside sanctuaries, modern luxury villas, and smart residential spaces.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We stand apart through our commitment to transparency, digital-first listing verification, and sustainable, eco-friendly luxury living. We believe your home should be a natural extension of the breathtaking Himalayan environment.
            </p>
            
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="font-semibold text-foreground">100% Verified Listings</h4>
                <p className="mt-1.5 text-sm text-muted-foreground">Every villa, plot, and flat is physically checked and legally vetted by our real estate experts.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="font-semibold text-foreground">Local Expertise</h4>
                <p className="mt-1.5 text-sm text-muted-foreground">Deeply rooted in Dehradun with decades of collective experience in local development regulations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI RECOMMENDATIONS TEASER */}
      <section className="container-x mt-28">
        <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> AI Recommendations
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold">
              Tell us how you live. We'll find the home.
            </h2>
            <p className="mt-3 text-primary-foreground/80 max-w-lg">
              Our recommendation engine matches you to listings using budget, commute, schools and lifestyle. Onboarding takes under 60 seconds.
            </p>
            <Link to="/properties" className="mt-6 inline-flex">
              <Button size="lg" variant="secondary" className="h-12 px-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Get my matches <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x mt-28">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Testimonials</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Loved by Doon Valley families</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-foreground/90 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="container-x mt-28 mb-20 scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-wider">Get In Touch</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Contact Our Advisers</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Have questions about a listing, zoning, or looking for a custom property search? Fill out the form or reach out directly. Our property experts are here to guide you.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Our Headquarters</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Suite 402, Pine Crest Tower, Rajpur Road, Dehradun, Uttarakhand 248001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Phone Number</h4>
                  <p className="mt-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <a href="tel:+918883732637">+91 888-DREAM-DDR</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email Inquiry</h4>
                  <p className="mt-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <a href="mailto:contact@dehradundreams.com">contact@dehradundreams.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Business Hours</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Monday – Saturday: 9:00 AM – 7:00 PM (Sunday Closed)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-soft">
              <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Rohan Sharma"
                      required
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. rohan@gmail.com"
                      required
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="bg-background border-border focus-visible:ring-primary h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Your Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us about the property you are interested in..."
                    required
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border focus-visible:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-medium transition-all duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending message...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
