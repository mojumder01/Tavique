/**
 * Static export (e.g. GitHub Pages): set STATIC_EXPORT=true at build time.
 * See docs/DEPLOYMENT.md → "GitHub Pages (static export)".
 */
export const isStaticExport = process.env.STATIC_EXPORT === "true";

/** Sub-path the site is served from, e.g. "/Tavique" for https://user.github.io/Tavique. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const STORE_COOKIE = "tavique-store";

/**
 * Runs before first paint in a static export: marks the storefront saved in the cookie so
 * pre-rendered shared pages hide the other storefronts' markup until React picks the right one.
 */
export const storeCookieScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${STORE_COOKIE}=([a-z]+)/);if(m)document.documentElement.dataset.cookieStore=m[1]}catch(e){}})();`;
