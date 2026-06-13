export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  content: string;
  table_data?: string;
  target_state: string | null;
  status: string;
  updated_at: string;
}

export interface GeographicSiloLinkPost {
  id: string;
  title: string;
  slug: string;
  target_state: string | null;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  updated_at: string;
}

export interface SitemapDirectoryPost {
  title: string;
  slug: string;
  target_state: string | null;
}

export interface SitemapPostEntry {
  slug: string;
  updated_at: string;
}
