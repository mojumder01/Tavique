"use client";

import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/commerce/SearchBar";
import { CountBadge, IconButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/store/hydration";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import type { StoreId } from "@/types/catalog";
import type { NavItem, StoreConfig } from "@/types/store";
import { DesktopNavigation } from "./DesktopNavigation";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";

export interface HeaderProps {
  store: StoreId;
  logo: StoreConfig["logo"];
  layout: StoreConfig["header"]["layout"];
  sticky: boolean;
  nav: NavItem[];
  search: StoreConfig["search"];
  hasDarkTheme: boolean;
  showSwitcher: boolean;
}

export function SiteHeader({ store, logo, layout, sticky, nav, search, hasDarkTheme, showSwitcher }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bag = hydrated ? cartCount : 0;
  const saved = hydrated ? wishCount : 0;

  const actions = (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {layout !== "search" && (
        // The centered layout shows search on the left on small screens, so hide this copy there.
        <span className={layout === "centered" ? "hidden lg:contents" : "contents"}>
          <IconButton label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="size-[1.15rem]" aria-hidden />
          </IconButton>
        </span>
      )}
      {hasDarkTheme && <ThemeToggle />}
      <Link href="/account" aria-label="Account" title="Account" className="hidden size-10 items-center justify-center rounded-full hover:bg-muted sm:inline-flex">
        <User className="size-[1.15rem]" aria-hidden />
      </Link>
      <Link href="/wishlist" aria-label={`Wishlist${saved ? `, ${saved} saved` : ""}`} title="Wishlist" className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted">
        <Heart className="size-[1.15rem]" aria-hidden />
        {saved > 0 && <CountBadge count={saved} />}
      </Link>
      <button type="button" onClick={() => setCartOpen(true)} aria-label={`Bag, ${bag} ${bag === 1 ? "item" : "items"}`} title="Bag" className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted">
        <ShoppingBag className="size-[1.15rem]" aria-hidden />
        {bag > 0 && <CountBadge count={bag} />}
      </button>
    </div>
  );

  const menuButton = (
    <IconButton label="Open menu" onClick={() => setMenuOpen(true)} className="-ml-2 lg:hidden" aria-haspopup="dialog">
      <Menu className="size-5" aria-hidden />
    </IconButton>
  );

  return (
    <>
      <header className={cn("z-30 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85", sticky && "sticky top-0", scrolled && "shadow-[0_8px_24px_-18px_rgb(0_0_0/0.35)]")}>
        {layout === "classic" && (
          <div className="page flex h-16 items-center gap-4 lg:h-[4.5rem]">
            {menuButton}
            <Logo store={store} logo={logo} />
            <DesktopNavigation items={nav} className="hidden flex-1 justify-center lg:flex" align="center" />
            <div className="ml-auto lg:ml-0">{actions}</div>
          </div>
        )}

        {layout === "search" && (
          <>
            <div className="page flex h-16 items-center gap-3 lg:h-[4.5rem] lg:gap-8">
              {menuButton}
              <Logo store={store} logo={logo} />
              <SearchBar store={store} placeholder={search.placeholder} popular={search.popular} className="hidden max-w-2xl flex-1 md:block" />
              <div className="ml-auto">{actions}</div>
            </div>
            <div className="page pb-3 md:hidden">
              <SearchBar store={store} placeholder={search.placeholder} popular={search.popular} />
            </div>
            <div className="hidden border-t border-line lg:block">
              <DesktopNavigation items={nav} className="page" />
            </div>
          </>
        )}

        {layout === "centered" && (
          <>
            <div className="page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-4 lg:h-20">
              <div className="flex items-center gap-1">
                {menuButton}
                <IconButton label="Search" onClick={() => setSearchOpen(true)} className="lg:hidden">
                  <Search className="size-[1.15rem]" aria-hidden />
                </IconButton>
              </div>
              <Logo store={store} logo={logo} className="justify-self-center" />
              <div className="justify-self-end">{actions}</div>
            </div>
            <div className="hidden pb-2 lg:block">
              <DesktopNavigation items={nav} align="center" tone="caps" className="page" />
            </div>
          </>
        )}
      </header>
      <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} items={nav} store={store} showSwitcher={showSwitcher} />
    </>
  );
}
