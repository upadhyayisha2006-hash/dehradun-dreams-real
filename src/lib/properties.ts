import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";
import p6 from "@/assets/property-6.jpg";

export type PropertyType = "Apartment" | "Villa" | "House" | "Penthouse" | "Plot";
export type ListingMode = "Buy" | "Rent";

export interface Property {
  id: string;
  title: string;
  price: number; // INR
  mode: ListingMode;
  type: PropertyType;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // sq ft
  images: string[];
  description: string;
  amenities: string[];
  nearby: string[];
  agent: { name: string; phone: string; whatsapp: string };
  featured?: boolean;
  createdAt: string;
}

export const LOCATIONS = [
  "Rajpur Road",
  "Sahastradhara Road",
  "Prem Nagar",
  "Clement Town",
  "Ballupur",
  "Mussoorie Road",
] as const;

const agent = {
  name: "Aarav Sharma",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
};

export const PROPERTIES: Property[] = [
  {
    id: "dp-001",
    title: "Hillside Glass Villa with Himalayan Views",
    price: 42500000,
    mode: "Buy",
    type: "Villa",
    location: "Mussoorie Road",
    address: "Kothi 12, Mussoorie Road, Dehradun, UK 248009",
    bedrooms: 5,
    bathrooms: 6,
    area: 6200,
    images: [p2, p4, p1, p3],
    description:
      "An architectural masterpiece nestled in the pine-clad foothills off Mussoorie Road. Floor-to-ceiling glass, a heated pool, and panoramic mountain vistas define this private retreat.",
    amenities: ["Private Pool", "Smart Home", "Home Theatre", "Garden", "Covered Parking", "Power Backup"],
    nearby: ["Mussoorie (32 km)", "Doon School (8 km)", "Robber's Cave (6 km)"],
    agent,
    featured: true,
    createdAt: "2026-04-12",
  },
  {
    id: "dp-002",
    title: "Modern 3BHK Apartment in Rajpur Greens",
    price: 12800000,
    mode: "Buy",
    type: "Apartment",
    location: "Rajpur Road",
    address: "Tower B, Rajpur Greens, Rajpur Road, Dehradun",
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    images: [p1, p4, p6],
    description:
      "Bright, well-ventilated 3BHK in a gated community on Rajpur Road. Walking distance to cafés, schools and the IT corridor.",
    amenities: ["Clubhouse", "Gym", "Kids Play Area", "24x7 Security", "Lift", "Visitor Parking"],
    nearby: ["Pacific Mall (2 km)", "Welham Girls' School (3 km)", "Dilaram Chowk (1.5 km)"],
    agent,
    featured: true,
    createdAt: "2026-05-02",
  },
  {
    id: "dp-003",
    title: "Garden Bungalow near Sahastradhara",
    price: 28500000,
    mode: "Buy",
    type: "House",
    location: "Sahastradhara Road",
    address: "Lane 4, Sahastradhara Road, Dehradun",
    bedrooms: 4,
    bathrooms: 4,
    area: 3400,
    images: [p3, p1, p2],
    description:
      "Charming independent bungalow with a manicured garden and double-height living room. Quiet neighbourhood, minutes from IT Park.",
    amenities: ["Private Garden", "Modular Kitchen", "Servant Quarter", "Solar Heater"],
    nearby: ["IT Park (4 km)", "Sahastradhara Springs (7 km)", "Max Hospital (5 km)"],
    agent,
    featured: true,
    createdAt: "2026-05-20",
  },
  {
    id: "dp-004",
    title: "Cozy 2BHK Rental in Prem Nagar",
    price: 22000,
    mode: "Rent",
    type: "Apartment",
    location: "Prem Nagar",
    address: "Block C, Doon Residency, Prem Nagar, Dehradun",
    bedrooms: 2,
    bathrooms: 2,
    area: 1150,
    images: [p6, p1, p4],
    description:
      "Fully furnished 2BHK ideal for young professionals and small families. Bright balcony with hill views and ample storage.",
    amenities: ["Furnished", "Power Backup", "Lift", "Reserved Parking"],
    nearby: ["UPES Campus (2 km)", "Premnagar Market (500 m)"],
    agent,
    createdAt: "2026-06-01",
  },
  {
    id: "dp-005",
    title: "Brick Townhouse in Ballupur",
    price: 18500000,
    mode: "Buy",
    type: "House",
    location: "Ballupur",
    address: "Sector 5, Ballupur Crossing, Dehradun",
    bedrooms: 4,
    bathrooms: 3,
    area: 2600,
    images: [p5, p3, p1],
    description:
      "Spacious 4BHK townhouse with a private driveway, landscaped front yard and abundant natural light throughout.",
    amenities: ["Driveway", "Modular Kitchen", "Study Room", "Terrace"],
    nearby: ["Ballupur Chowk (300 m)", "Doon Hospital (4 km)"],
    agent,
    createdAt: "2026-04-28",
  },
  {
    id: "dp-006",
    title: "Penthouse with Valley View, Clement Town",
    price: 75000,
    mode: "Rent",
    type: "Penthouse",
    location: "Clement Town",
    address: "Penthouse 9F, Skyline Heights, Clement Town, Dehradun",
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    images: [p4, p2, p1],
    description:
      "Premium penthouse with a private rooftop terrace overlooking the Doon Valley. Designer interiors and dual-key layout.",
    amenities: ["Rooftop Terrace", "Smart Home", "Concierge", "Gym", "Pool"],
    nearby: ["Tibetan Monastery (1 km)", "FRI (6 km)", "ISBT (7 km)"],
    agent,
    featured: true,
    createdAt: "2026-05-30",
  },
  {
    id: "dp-007",
    title: "Compact 1BHK Studio on Rajpur Road",
    price: 14500,
    mode: "Rent",
    type: "Apartment",
    location: "Rajpur Road",
    address: "Doon Court, Rajpur Road, Dehradun",
    bedrooms: 1,
    bathrooms: 1,
    area: 620,
    images: [p6, p1],
    description: "Minimalist studio perfect for students or solo professionals. Walk to cafés and gym.",
    amenities: ["Furnished", "WiFi Ready", "Lift", "Power Backup"],
    nearby: ["Astley Hall (2 km)", "Pacific Mall (2 km)"],
    agent,
    createdAt: "2026-06-08",
  },
  {
    id: "dp-008",
    title: "Forest-Edge Villa, Mussoorie Road",
    price: 56000000,
    mode: "Buy",
    type: "Villa",
    location: "Mussoorie Road",
    address: "Pine Estate, Mussoorie Road, Dehradun",
    bedrooms: 6,
    bathrooms: 7,
    area: 7800,
    images: [p2, p4, p3],
    description: "Ultra-luxury villa bordered by deodar forest with private spa, cinema and entertaining pavilion.",
    amenities: ["Spa", "Home Cinema", "Wine Cellar", "Pool", "Smart Home", "Helipad Access"],
    nearby: ["Mussoorie (28 km)", "George Everest House"],
    agent,
    createdAt: "2026-03-15",
  },
];

export function formatINR(value: number, mode?: ListingMode): string {
  const isRent = mode === "Rent";
  if (isRent) return `₹${value.toLocaleString("en-IN")}/mo`;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function getProperty(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}

export function similarProperties(p: Property, n = 3): Property[] {
  return PROPERTIES.filter((x) => x.id !== p.id && (x.location === p.location || x.type === p.type)).slice(0, n);
}
