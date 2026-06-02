export type Category = "make-up-vanity" | "bath-and-body" | "self-care" | "salon";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  category: Category;
  rating: number;
  reviews: number;
  shades?: { name: string; hex: string }[];
  ingredients?: string[];
  badges?: string[];
  description: string;
  details: string[];
  image: string; // gradient seed
  hue: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

const img = (hue: number, sat = 35) =>
  `radial-gradient(circle at 30% 30%, hsl(${hue} ${sat}% 88%), hsl(${hue} ${sat}% 70%) 45%, hsl(${(hue + 20) % 360} ${sat}% 38%) 100%)`;

export const categories: { id: Category; name: string; tagline: string; hue: number }[] = [
  { id: "make-up-vanity", name: "Make-up vanity", tagline: "Luxury glam, daily wear", hue: 350 },
  { id: "bath-and-body", name: "Bath and body", tagline: "Rituals for skin and scent", hue: 35 },
  { id: "self-care", name: "Self care", tagline: "Hand-finished wellness essentials", hue: 95 },
  { id: "salon", name: "Salon", tagline: "Salon-grade treatments", hue: 150 },
];

export const products: Product[] = [
  {
    id: "p1", slug: "velvet-lip-serum", name: "Velvet Lip Serum",
    tagline: "Plumping rose-cacao tint",
    price: 1490, compareAt: 1890, category: "make-up-vanity", rating: 4.9, reviews: 412,
    shades: [
      { name: "Bare Petal", hex: "#d6a89a" },
      { name: "Rose Smoke", hex: "#b87268" },
      { name: "Ember", hex: "#7d3a32" },
      { name: "Plum Noir", hex: "#4a2230" },
    ],
    ingredients: ["Squalane", "Hyaluronic Acid", "Cacao Butter", "Vitamin E"],
    badges: ["Vegan", "Cruelty-Free"], isBestseller: true,
    description: "A weightless serum-tint that hydrates and sculpts the lip in a single glide. Buildable, never sticky.",
    details: ["8ml glass refillable vial", "Made in France", "Dermatologist-tested"],
    image: img(355, 45), hue: 355,
  },
  {
    id: "p2", slug: "luminous-skin-tint", name: "Luminous Skin Tint",
    tagline: "Second-skin radiance, SPF 30",
    price: 2290, category: "make-up-vanity", rating: 4.8, reviews: 289,
    shades: Array.from({ length: 12 }).map((_, i) => ({
      name: `Shade 0${i + 1}`,
      hex: `hsl(${28 + i * 2} ${40 - i}% ${82 - i * 4}%)`,
    })),
    badges: ["SPF 30", "Niacinamide"], isNew: true,
    description: "A bare-skin finish in 12 luminous shades. Adapts to your tone with cushioning hyaluronic spheres.",
    details: ["30ml frosted glass", "Refill available", "Suitable for sensitive skin"],
    image: img(30, 35), hue: 30,
  },
  {
    id: "p3", slug: "neem-comb-classic", name: "Neem Wood Wide Comb",
    tagline: "Hand-cut, kiln-cured neem",
    price: 690, category: "self-care", rating: 5.0, reviews: 1284,
    badges: ["Wild-harvested", "Plastic-free"], isBestseller: true,
    description: "A traditional wide-tooth comb hand-finished from sustainably harvested neem. Anti-static and naturally antimicrobial.",
    details: ["Hand-cut in Coorg", "16cm length", "Lifetime craft warranty"],
    image: img(95, 28), hue: 95,
  },
  {
    id: "p4", slug: "neem-detangler-comb", name: "Neem Detangler",
    tagline: "Curl-friendly, no snag",
    price: 790, category: "self-care", rating: 4.9, reviews: 642,
    badges: ["Curl approved"],
    description: "Specially angled teeth glide through curls without breakage. Pair with our scalp serum for a daily ritual.",
    details: ["18cm length", "Engraved monogram option"],
    image: img(110, 30), hue: 110,
  },
  {
    id: "p5", slug: "vanity-mirror-aurora", name: "Aurora Vanity Mirror",
    tagline: "Tri-tone LED, brushed brass",
    price: 4990, compareAt: 5990, category: "bath-and-body", rating: 4.7, reviews: 174,
    badges: ["Brushed brass", "USB-C"], isNew: true,
    description: "A countertop mirror with three light temperatures and a magnetic dimmer. Designed to feel like daylight on demand.",
    details: ["1x / 5x magnification", "USB-C rechargeable", "2-year warranty"],
    image: img(45, 30), hue: 45,
  },
  {
    id: "p6", slug: "vanity-organizer", name: "Heirloom Organizer",
    tagline: "Travertine + walnut",
    price: 3490, category: "bath-and-body", rating: 4.6, reviews: 98,
    description: "Hand-poured travertine base with walnut compartments to cradle your most-loved rituals.",
    details: ["Made in Jaipur", "Modular inserts"],
    image: img(35, 22), hue: 35,
  },
  {
    id: "p7", slug: "rose-facial-oil", name: "Rose Otto Facial Oil",
    tagline: "Cold-pressed, 24-botanical",
    price: 2890, category: "salon", rating: 4.9, reviews: 502,
    ingredients: ["Rose Otto", "Squalane", "Bakuchiol", "Sea Buckthorn"],
    badges: ["Vegan", "Cold-pressed"], isBestseller: true,
    description: "A botanical face oil that drinks into the skin, leaving a velvet finish and a soft halo of rose.",
    details: ["30ml apothecary bottle", "Refillable"],
    image: img(15, 38), hue: 15,
  },
  {
    id: "p8", slug: "scalp-ritual-serum", name: "Scalp Ritual Serum",
    tagline: "Neem + rosemary + peptides",
    price: 1990, category: "salon", rating: 4.8, reviews: 318,
    badges: ["Microbiome-safe"],
    description: "A weightless scalp treatment that nourishes the root with neem extract, rosemary CO2, and copper peptides.",
    details: ["50ml dropper", "Use 3x weekly"],
    image: img(140, 28), hue: 140,
  },
  {
    id: "p9", slug: "kohl-pencil-noir", name: "Kohl Pencil Noir",
    tagline: "12-hour matte black",
    price: 990, category: "make-up-vanity", rating: 4.7, reviews: 220,
    shades: [
      { name: "Noir", hex: "#0a0a0a" },
      { name: "Bronze", hex: "#5b3a1f" },
      { name: "Forest", hex: "#1f3a2a" },
    ],
    description: "A buttery, water-resistant kohl that sets to a true matte. Glides without tugging.",
    details: ["Twist-up, no sharpener", "0.35g"],
    image: img(0, 5), hue: 0,
  },
  {
    id: "p10", slug: "highlight-balm", name: "Liquid Highlight Balm",
    tagline: "Wet-glass dewy finish",
    price: 1690, category: "make-up-vanity", rating: 4.8, reviews: 198,
    shades: [
      { name: "Champagne", hex: "#e8c89b" },
      { name: "Rose Gold", hex: "#d49a7e" },
      { name: "Bronze", hex: "#a86a3e" },
    ],
    description: "A fluid balm that catches the light without disturbing makeup. Press on with fingertips.",
    details: ["15ml glass jar"],
    image: img(40, 35), hue: 40,
  },
  {
    id: "p11", slug: "neem-beard-comb", name: "Neem Beard Comb",
    tagline: "Pocket-cut, hand-finished",
    price: 590, category: "salon", rating: 4.9, reviews: 412,
    description: "A travel-sized neem comb with closely-spaced teeth, ideal for beard grooming.",
    details: ["10cm length", "Cotton sleeve included"],
    image: img(85, 30), hue: 85,
  },
  {
    id: "p12", slug: "ritual-candle", name: "Forest Ritual Candle",
    tagline: "Vetiver, neem leaf, oud",
    price: 2190, category: "salon", rating: 4.8, reviews: 156,
    badges: ["48-hr burn"],
    description: "A botanical candle hand-poured in coconut wax. A grounding cloud of vetiver and oud.",
    details: ["220g vessel", "Lead-free wick"],
    image: img(150, 25), hue: 150,
  },
];

export const reviews = [
  { id: 1, name: "Aanya K.", rating: 5, title: "Worth every rupee", body: "The lip serum is unreal â€” I have replaced three balms with this one bottle. Plus, the packaging feels like a gift to yourself.", date: "2 weeks ago", verified: true },
  { id: 2, name: "Riya M.", rating: 5, title: "Neem comb is meditative", body: "I genuinely look forward to using it. Smells faintly herbal, my hair has never been smoother.", date: "1 month ago", verified: true },
  { id: 3, name: "Sara P.", rating: 4, title: "Loved the tint", body: "Adapted beautifully to my skin tone. Wish there was an even deeper shade.", date: "3 days ago", verified: true },
  { id: 4, name: "Maya D.", rating: 5, title: "My new ritual", body: "The candle + facial oil combo became my Sunday ritual. So calming.", date: "5 days ago", verified: true },
];

export const testimonials = [
  { name: "Vogue India", quote: "An indie label rewriting the rules of clean Indian luxury.", logo: "VOGUE" },
  { name: "Elle", quote: "Heirloom packaging meets clinical formulations.", logo: "ELLE" },
  { name: "Harper's Bazaar", quote: "The most quietly confident beauty launch of the year.", logo: "BAZAAR" },
  { name: "Femina", quote: "A botanical ritual you'll happily wait for.", logo: "FEMINA" },
];

export const faqs = [
  { q: "Are your products vegan?", a: "All formulations are vegan and cruelty-free. We test on volunteers, never animals." },
  { q: "Where do you ship?", a: "Across India with 2â€“4 day delivery, and worldwide via DHL Express." },
  { q: "What is your returns policy?", a: "30-day no-questions returns on unopened products. Opened items qualify for store credit." },
  { q: "How are neem combs sustainable?", a: "Each comb is hand-cut from fallen neem branches in Coorg. Zero plastic, zero waste." },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const productImage = (p: Product) => p.image;

