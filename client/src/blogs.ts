// blogs.ts

export interface Blog {
  _id: string;
  title: string;
  content: string;
  status: 'published' | 'draft';
  updated_at: string;
}

export const blogs: Blog[] = [
  {
    _id: '1',
    title: 'Sample Blog 1',
    content: '<p>Content for blog 1</p>',
    status: 'published',
    updated_at: '2025-05-18T10:00:00Z',
  },
  {
    _id: '2',
    title: 'Sample Blog 2',
    content: '<p>Content for blog 2</p>',
    status: 'draft',
    updated_at: '2025-05-17T15:00:00Z',
  },
];
