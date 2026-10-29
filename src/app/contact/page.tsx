import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/config/site.config";
import { getActiveStore } from "@/lib/active-store";
import { storeHome } from "@/lib/routes";

export const metadata: Metadata = { title: "Contact", description: "Questions about an order, a product or a return? Get in touch.", alternates: { canonical: "/contact" } };

export default async function ContactPage() {
  const store = await getActiveStore();
  const { contact } = siteConfig;
  const items = [
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/[^+\d]/g, "")}` },
    { icon: Clock, label: "Hours", value: contact.hours },
    { icon: MapPin, label: "Studio", value: contact.address },
  ];
  return (
    <StoreShell store={store}>
      <div className="page pt-6 pb-24 md:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: storeHome(store) }, { label: "Contact" }]} />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h1 className="heading text-4xl md:text-6xl">Get in touch</h1>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">We usually reply within one business day. For order questions, include your order reference.</p>
            <ul className="mt-10 space-y-6">
              {items.map((i) => (
                <li key={i.label} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <i.icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium">{i.label}</span>
                    {i.href ? (
                      <a href={i.href} className="text-fg-muted underline-offset-4 hover:text-fg hover:underline">
                        {i.value}
                      </a>
                    ) : (
                      <span className="text-fg-muted">{i.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative lg:col-span-7 lg:col-start-6">
            <ContactForm store={store} />
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
