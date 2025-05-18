import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlogList = ({ onEdit }) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [viewBlog, setViewBlog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const res = await axios.get('https://blogs-6tlu.onrender.com/api/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Format the timestamp into readable format
  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', { hour12: true });

  // When a blog is clicked, load into editor
  const handleSelect = (blog) => {
    setSelectedBlogId(blog._id);
    onEdit(blog);
  };

  // When blog is double-clicked, open preview modal
  const handleDoubleClick = (blog) => {
    setViewBlog(blog);
    setModalVisible(true);
  };

  // Close modal with fade-out
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setViewBlog(null), 300); // Delay to match fade animation
  };

  // Handle delete request
  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await axios.delete(`https://blogs-6tlu.onrender.com/api/blogs/${blogId}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      if (selectedBlogId === blogId) setSelectedBlogId(null);
      if (viewBlog && viewBlog._id === blogId) closeModal();
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Failed to delete blog.');
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>📜 All Blogs</h1>
      <h3 style={{ textAlign: 'center' }}>Click to Edit • Double Click to Preview</h3>

      {/* Published Blogs */}
      <section>
        <h3 style={{ color: 'gold' }}>✅ Published</h3>
        {blogs
          .filter((b) => b.status === 'published')
          .map((blog) => (
            <div
              key={blog._id}
              onClick={() => handleSelect(blog)}
              onDoubleClick={() => handleDoubleClick(blog)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: selectedBlogId === blog._id ? '#fff8e1' : '#e3f2fd',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                color: 'black',
              }}
              title="Click to edit, double click to view"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ flex: '1 1 70%' }}>
                <strong>{blog.title}</strong> — <em>{formatDate(blog.updated_at)}</em>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(blog._id);
                }}
                style={{
                  backgroundColor: '#e53935',
                  border: 'none',
                  color: 'black',
                  padding: '5px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b71c1c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
              >
                Delete
              </button>
            </div>
          ))}
      </section>

      {/* Draft Blogs */}
      <section>
        <h3 style={{ color: '#f57f17' }}>📝 Drafts</h3>
        {blogs
          .filter((b) => b.status === 'draft')
          .map((blog) => (
            <div
              key={blog._id}
              onClick={() => handleSelect(blog)}
              onDoubleClick={() => handleDoubleClick(blog)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: selectedBlogId === blog._id ? '#fffde7' : '#fff3e0',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                color: 'black',
              }}
              title="Click to edit, double click to view"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ flex: '1 1 70%' }}>
                <strong>{blog.title}</strong> — <em>{formatDate(blog.updated_at)}</em>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(blog._id);
                }}
                style={{
                  backgroundColor: '#e53935',
                  border: 'none',
                  color: 'black',
                  padding: '5px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b71c1c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
              >
                Delete
              </button>
            </div>
          ))}
      </section>

      {/* Modal for blog preview */}
      {viewBlog && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            opacity: modalVisible ? 1 : 0,
            pointerEvents: modalVisible ? 'auto' : 'none',
            transition: 'opacity 300ms ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transform: modalVisible ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'transform 300ms ease',
              color: 'black',
            }}
          >
            <h2>{viewBlog.title}</h2>
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

      {/* Developer Credit */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'white' }}>
        Developed by{' '}
        <a
          href="https://www.linkedin.com/in/govarthan-v/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#64b5f6', textDecoration: 'none' }}
        >
          Govarthan V
        </a>
      </div>
    </div>
  );
};

export default BlogList;
