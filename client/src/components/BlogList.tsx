import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Blog = {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  updated_at: string;
};

type BlogListProps = {
  onEdit: (blog: Blog) => void;
};

const BlogList: React.FC<BlogListProps> = ({ onEdit }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-IN', { hour12: true });

  const handleSelect = (blog: Blog) => {
    setSelectedBlogId(blog._id);
    onEdit(blog);
  };

  // Open modal with fade-in effect
  const handleDoubleClick = (blog: Blog) => {
    setViewBlog(blog);
    setModalVisible(true);
  };

  // Close modal with fade-out effect
  const closeModal = () => {
    setModalVisible(false);
    // Wait for fade out animation before clearing blog
    setTimeout(() => setViewBlog(null), 300);
  };

  // Delete blog handler
  const handleDelete = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`);
      setBlogs(prev => prev.filter(b => b._id !== blogId));
      // If deleted blog is selected or viewed, reset those states
      if (selectedBlogId === blogId) setSelectedBlogId(null);
      if (viewBlog && viewBlog._id === blogId) closeModal();
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Failed to delete blog.');
    }
  };

  return (
    <>
      <h2 style={{ color: '#222' }}>📜 All Blogs</h2>

      <div>
        <h3 style={{ color: '#00796b' }}>Published</h3>
        {blogs
          .filter(blog => blog.status === 'published')
          .map(blog => (
            <div
              key={blog._id}
              onClick={() => handleSelect(blog)}
              onDoubleClick={() => handleDoubleClick(blog)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                borderBottom: '1px solid #ccc',
                backgroundColor: selectedBlogId === blog._id ? '#e0f7fa' : undefined,
                userSelect: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#004d40',
              }}
              title="Click to edit, double click to view"
            >
              <div>
                <strong>{blog.title}</strong> — <em>{formatDate(blog.updated_at)}</em>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleDelete(blog._id);
                }}
                style={{
                  backgroundColor: '#d32f2f',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                aria-label={`Delete blog titled ${blog.title}`}
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#f9a825' }}>Drafts</h3>
        {blogs
          .filter(blog => blog.status === 'draft')
          .map(blog => (
            <div
              key={blog._id}
              onClick={() => handleSelect(blog)}
              onDoubleClick={() => handleDoubleClick(blog)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                borderBottom: '1px solid #ccc',
                backgroundColor: selectedBlogId === blog._id ? '#fff9c4' : undefined,
                userSelect: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#f57f17',
              }}
              title="Click to edit, double click to view"
            >
              <div>
                <strong>{blog.title}</strong> — <em>{formatDate(blog.updated_at)}</em>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleDelete(blog._id);
                }}
                style={{
                  backgroundColor: '#d32f2f',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                aria-label={`Delete draft titled ${blog.title}`}
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      {/* Modal with fade transition */}
      {viewBlog && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: modalVisible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            opacity: modalVisible ? 1 : 0,
            pointerEvents: modalVisible ? 'auto' : 'none',
            transition: 'opacity 300ms ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transform: modalVisible ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'transform 300ms ease',
            }}
          >
            <h2 style={{ color: '#222' }}>{viewBlog.title}</h2>
            <p>
              <strong>Status:</strong>{' '}
              <span style={{ textTransform: 'capitalize' }}>{viewBlog.status}</span>
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{ __html: viewBlog.content }}
              style={{ whiteSpace: 'pre-wrap', color: '#333' }}
            />
            <button
              style={{
                marginTop: 20,
                backgroundColor: '#1976d2',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogList;
