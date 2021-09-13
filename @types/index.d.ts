declare global {
  interface Window {
    ferdi: any;
  }
}

/**
 * Workaround to make TS recognize this file as a module.
 * https://fettblog.eu/typescript-augmenting-global-lib-dom/
 */
export {};
