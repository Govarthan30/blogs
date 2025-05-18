import { useState } from 'react';
import Editor from './components/Editor';
import BlogList from './components/BlogList';

type Blog = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
};

function App() {
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 Blog Editor</h1>

      <Editor blogToEdit={editBlog} onSave={() => setEditBlog(null)} />

      <hr style={{ margin: '40px 0' }} />

      {/* Cast setEditBlog to avoid type incompatibility */}
      <BlogList onEdit={setEditBlog as (blog: Blog) => void} />
    </div>
  );
}

export default App;
