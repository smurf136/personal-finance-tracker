import { pageBackground, semanticColors, THEME_STORAGE_KEY } from "./tokens";

/** Inline script run before first paint so the page never flashes the wrong theme. */
export const themeInitScript = `(function(){try{var m=null;try{m=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}var d=m==="dark"||((m!=="light")&&window.matchMedia("(prefers-color-scheme: dark)").matches);var t=d?"dark":"light";var bg=${JSON.stringify(
  pageBackground,
)};var c=${JSON.stringify(semanticColors)};var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;r.style.setProperty("--pft-bg",bg[t]);r.style.setProperty("--pft-income",c[t].income);r.style.setProperty("--pft-expense",c[t].expense)}catch(e){}})();`;
