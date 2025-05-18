export type Blog = {
  _id: string;
  title: string;
  content: string;
  tags: string[]; // ⚠ This is missing in blogs.ts mock data
  status: 'draft' | 'published';
  updated_at: string;
};
