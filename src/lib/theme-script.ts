/**
 * Runs before first paint to apply the saved light/dark preference without a flash.
 * Only storefronts that define a dark palette react to `data-theme="dark"`.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("tavique-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;
