import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { siteConfig } from "@/config/site.config";
import type { StoreConfig } from "@/types/store";
import { Logo } from "./Logo";
import { StoreSwitcher } from "./StoreSwitcher";

export function SiteFooter({ config, newsletter = true }: { config: StoreConfig; newsletter?: boolean }) {
  return (
    <footer className="mt-auto border-t border-line bg-surface text-fg">
      {newsletter && (
        <div className="border-b border-line">
          <div className="page grid grid-cols-1 gap-6 py-12 md:grid-cols-2 md:items-end md:py-14">
            <div>
              <h2 className="heading text-3xl">{config.newsletter.title}</h2>
              <p className="mt-2 max-w-md text-sm text-fg-muted">{config.newsletter.body}</p>
            </div>
            <NewsletterForm store={config.id} id="footer-newsletter" />
          </div>
        </div>
      )}
      <div className="page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo store={config.id} logo={config.logo} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">{config.footer.blurb}</p>
          <address className="mt-6 space-y-1 text-sm text-fg-muted not-italic">
            <p>{siteConfig.contact.address}</p>
            <p>
              <a href={`mailto:${siteConfig.contact.email}`} className="underline-offset-4 hover:text-fg hover:underline">
                {siteConfig.contact.email}
              </a>
            </p>
            <p>{siteConfig.contact.hours}</p>
          </address>
        </div>
        {config.footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
            <h2 className="eyebrow mb-4 text-fg">{col.title}</h2>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        {siteConfig.showStoreSwitcher && <StoreSwitcher current={config.id} variant="list" className="lg:col-span-2" />}
      </div>
      <div className="border-t border-line">
        <div className="page flex flex-col gap-2 py-6 text-xs text-fg-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Demo storefront — no real orders or payments are processed.
          </p>
          <p>Card · PayPal · Cash on delivery (demo options)</p>
        </div>
      </div>
    </footer>
  );
}
