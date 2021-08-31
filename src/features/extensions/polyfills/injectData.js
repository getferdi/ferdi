/**
 * Inject data from Ferdi into the webview
 */
const createInjectScript = () => {
  const data = {
    currentUrl: window.ferdi.stores.services.active.webview.src,
  };
  return data;
};
export default createInjectScript;
