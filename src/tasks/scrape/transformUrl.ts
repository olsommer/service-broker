export function transformUrl(inputUrl: string): string {
  // Remove 'https://' or 'http://' if present
  let transformedUrl = inputUrl.replace(/^(https?:\/\/)/, "");

  // Remove 'www.' if present
  transformedUrl = transformedUrl.replace(/^www\./, "");

  // Add 'https://' back if the input URL had it
  if (inputUrl.startsWith("https://")) {
    transformedUrl = "https://" + transformedUrl;
  } else if (inputUrl.startsWith("http://")) {
    transformedUrl = "http://" + transformedUrl;
  }

  return transformedUrl;
}
