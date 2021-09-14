export default function handleDeepLink(window, rawUrl) {
  const url = rawUrl.replace('ferdi://', '');

  if (!url) return;

  window.webContents.send('navigateFromDeepLink', { url });
}
