export const SITE_NAME = "Notary Guide";
export const SITE_DESCRIPTION =
  "Expert guides and resources on notary services, requirements, and best practices across the United States.";

export const SITE_URL = "https://aboutnotary.com";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;
  return url.replace(/\/$/, "");
}
