import { commerceConfig } from "@/config/commerce.config";
import type { FAQItem } from "@/components/ui/FAQAccordion";

const standard = commerceConfig.shippingMethods.find((m) => "freeOver" in m);

/** Shared help-centre content. Edit freely — it's plain data. */
export const faqGroups: { title: string; items: FAQItem[] }[] = [
  {
    title: "Orders & payment",
    items: [
      { q: "Is this a real store?", a: "No. Tavique is a demo storefront for a website template. You can browse, add to your bag and place a demo order, but no payment is taken, nothing ships and no emails are sent." },
      { q: "Which payment methods do you accept?", a: "The demo shows card, PayPal and cash on delivery as options. Card details are never collected — a production store would use a PCI-compliant provider's hosted payment fields." },
      { q: "Can I change or cancel my order?", a: "In a live store you'd typically be able to change an order within an hour of placing it. In this demo, orders are stored only in your browser and can't be modified." },
      { q: "Do you offer discount codes?", a: `Yes — try ${commerceConfig.discountCodes.map((d) => d.code).join(", ")} in your bag or at checkout. Each code has its own rules, shown when you apply it.` },
    ],
  },
  {
    title: "Shipping & delivery",
    items: [
      { q: "How much does shipping cost?", a: `Standard shipping is $${standard?.price ?? 8} and free on orders over $${standard?.freeOver ?? 150}. Express and next-day options are available at checkout.` },
      { q: "How long will delivery take?", a: commerceConfig.shippingMethods.map((m) => `${m.label}: ${m.description}.`).join(" ") },
      { q: "Do you ship internationally?", a: `The demo checkout lists ${commerceConfig.countries.length} countries. Replace this list and your rates with your own shipping zones.` },
    ],
  },
  {
    title: "Returns, warranty & care",
    items: [
      { q: "What is your returns policy?", a: "Unused items in their original packaging can be returned free of charge within 30 days of delivery. Personal-care products must be unopened for hygiene reasons." },
      { q: "Is there a warranty on electronics?", a: "Every device in the electronics store includes a 2-year limited warranty against manufacturing defects. Accidental damage cover can be added in a live store." },
      { q: "How do I find my size?", a: "Each apparel and footwear product has a size guide next to the size selector, with fit notes from our design team." },
    ],
  },
];
