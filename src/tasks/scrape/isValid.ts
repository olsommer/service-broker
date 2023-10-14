export function isValidUrl(url: string): boolean {
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(:[0-9]+)?(\/[^\s]*)?$/;
  return urlPattern.test(url);
}
