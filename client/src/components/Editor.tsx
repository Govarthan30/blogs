import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import debounce from 'lodash/debounce';
import { toast, ToastContainer } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

type Blog = {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  status?: 'draft' | 'published';
};

type EditorProps = {
  blogToEdit?: Blog | null;
  onSave: () => void;
};

const Editor: React.FC<EditorProps> = ({ blogToEdit, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [id, setId] = useState<string | null>(null);

  // Populate form when blogToEdit changes
  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title);
      setContent(blogToEdit.content);
      setTags(blogToEdit.tags.join(', '));
      setId(blogToEdit._id || null);
    } else {
      setTitle('');
      setContent('');
      setTags('');
      setId(null);
    }
  }, [blogToEdit]);

  const autoSave = async () => {
    if (!title.trim() && !content.trim()) return; // don't save empty

    try {
      const res = await axios.post('http://localhost:5000/api/blogs/save-draft', {
        id,
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setId(res.data._id);
      toast.success('Auto-saved!', { autoClose: 1000 });
      onSave();
    } catch (err) {
      toast.error('Auto-save failed!');
    }
  };

  // Save every 30s
  React.useEffect(() => {
    const interval = setInterval(() => {
      autoSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [title, content, tags, id]);

  // Debounced save after 5s inactivity
  const debouncedAutoSave = debounce(autoSave, 5000);
  React.useEffect(() => {
    debouncedAutoSave();
    return debouncedAutoSave.cancel;
  }, [title, content, tags]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/blogs/publish', {
        id,
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast.success('Published!');
      setId(null);
      setTitle('');
      setContent('');
      setTags('');
      onSave();
    } catch {
      toast.error('Failed to publish.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '18px' }}
      />
      <ReactQuill value={content} onChange={setContent} />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        style={{ width: '100%', padding: '10px', marginTop: '10px' }}
      />
      <div style={{ marginTop: 20 }}>
        <button onClick={handlePublish} style={{ padding: '10px 20px' }}>
          Publish
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Editor;
