// src/types.ts
export type Blog = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
};
