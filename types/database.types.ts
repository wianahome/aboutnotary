export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  content: string;
  table_data?: string;
  updated_at: string;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  updated_at: string;
}
