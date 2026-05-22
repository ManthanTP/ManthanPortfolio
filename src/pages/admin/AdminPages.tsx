/* Admin sub-pages — placeholder components for all admin sections */

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Project, Post, Skill, Experience, Message, GalleryItem } from '../../lib/supabase';
import ImageCropperModal from '../../components/ui/ImageCropperModal';

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Basic form state
  type ProjectFormData = Partial<Project> & { techStackRaw?: string, imagesRaw?: string, featuresRaw?: string };
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '', slug: '', description: '', visible: true, featured: false, order_index: 0
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSave = async () => {
    try {
      const { techStackRaw, imagesRaw, featuresRaw, ...dataToSave } = formData;
      if (editingId) {
        await api.projects.update(editingId, dataToSave);
      } else {
        await api.projects.create(dataToSave as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
      }
      setEditingId(null);
      setFormData({ title: '', slug: '', description: '', visible: true, featured: false, order_index: 0, techStackRaw: undefined, imagesRaw: undefined, featuresRaw: undefined });
      loadProjects();
    } catch (err) {
      console.error(err);
      alert('Error saving project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.projects.delete(id);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setFormData({ 
      ...p, 
      techStackRaw: undefined, 
      imagesRaw: undefined, 
      featuresRaw: undefined 
    });
  };

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Projects Manager</h1>
      
      {/* Form Area */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ marginBottom: 16 }}>{editingId ? 'Edit Project' : 'New Project'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <input placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="admin-input" />
          <input placeholder="Slug (e.g. smart-campus)" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="admin-input" />
          
          <input placeholder="GitHub URL" value={formData.github_url || ''} onChange={e => setFormData({...formData, github_url: e.target.value})} className="admin-input" />
          <input placeholder="Live Demo URL" value={formData.live_url || ''} onChange={e => setFormData({...formData, live_url: e.target.value})} className="admin-input" />
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Categories</label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['AI', 'Web Apps', 'Dashboards', 'Mobile'].map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={(formData.category || []).includes(cat)}
                    onChange={(e) => {
                      const current = formData.category || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, category: [...current, cat] });
                      } else {
                        setFormData({ ...formData, category: current.filter(c => c !== cat) });
                      }
                    }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Image URLs</label>
            <input placeholder="Image URLs (comma separated)" value={formData.imagesRaw !== undefined ? formData.imagesRaw : (formData.images || []).join(', ')} onChange={e => setFormData({...formData, imagesRaw: e.target.value, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="admin-input" style={{ marginBottom: 8 }} />
            
            {/* Image Previews */}
            {formData.images && formData.images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {formData.images.map((img, i) => (
                  <img key={i} src={img} alt="preview" style={{ height: 60, width: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} />
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    try {
                      const url = await api.storage.uploadImage(file);
                      setFormData(prev => ({...prev, images: [...(prev.images || []), url]}));
                    } catch (err) {
                      console.error("Upload failed", err);
                      alert("Upload failed. Make sure you created the 'portfolio-media' storage bucket and set it to Public!");
                    }
                  }
                }} 
                style={{ fontSize: '0.8rem' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Or upload a file directly</span>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Tech Stack</label>
            <input placeholder="React, Node.js, TypeScript" value={formData.techStackRaw !== undefined ? formData.techStackRaw : (formData.tech_stack || []).map((t: any) => t.name).join(', ')} onChange={e => setFormData({...formData, techStackRaw: e.target.value, tech_stack: e.target.value.split(',').map(s => ({ name: s.trim() })).filter(t => t.name)})} className="admin-input" />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Description</label>
            <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="admin-input" style={{ width: '100%', minHeight: 80 }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Key Features (one per line)</label>
            <textarea 
              placeholder="Real-time data processing...&#10;AI-powered analytics..." 
              value={formData.featuresRaw !== undefined ? formData.featuresRaw : (formData.features || []).join('\n')} 
              onChange={e => setFormData({...formData, featuresRaw: e.target.value, features: e.target.value.split('\n').filter(s => s.trim() !== '')})} 
              className="admin-input" 
              style={{ width: '100%', minHeight: 100 }} 
            />
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={formData.visible || false} onChange={e => setFormData({...formData, visible: e.target.checked})} /> Visible
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={formData.featured || false} onChange={e => setFormData({...formData, featured: e.target.checked})} /> Featured
          </label>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button onClick={handleSave} className="btn-primary">Save Project</button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({ title: '', slug: '', description: '', visible: true, featured: false, order_index: 0, techStackRaw: undefined, imagesRaw: undefined, featuresRaw: undefined }); }} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      {/* List Area */}
      <div className="glass-card" style={{ padding: 24 }}>
        {loading ? <p>Loading projects...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p style={{ marginBottom: 16 }}>Your database is currently empty.</p>
                    <button 
                      onClick={async () => {
                        const { DEMO_PROJECTS } = await import('../../lib/data');
                        for (const p of DEMO_PROJECTS) {
                          await api.projects.create({
                            slug: p.title.toLowerCase().replace(/\s+/g, '-'),
                            title: p.title,
                            description: p.description,
                            category: p.category || [],
                            tech_stack: p.tech_stack,
                            images: p.images,
                            github_url: p.github_url,
                            live_url: p.live_url,
                            featured: true,
                            visible: true,
                            order_index: 0
                          });
                        }
                        loadProjects();
                      }}
                      className="btn-secondary"
                    >
                      Load Demo Data
                    </button>
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>{p.title}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                      {p.visible ? <span style={{ color: 'var(--accent-cyan)' }}>Visible</span> : <span style={{ color: 'var(--text-secondary)' }}>Hidden</span>}
                      {p.featured && <span style={{ marginLeft: 8 }}>⭐</span>}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                      <button onClick={() => startEdit(p)} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', marginRight: 6 }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: '1px solid #ff4444', borderRadius: 6, padding: '4px 10px', color: '#ff4444', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


export function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '', slug: '', excerpt: '', content: '', status: 'published', read_time: 5
  });

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.posts.getAll();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.posts.update(editingId, formData);
      } else {
        await api.posts.create(formData as Omit<Post, 'id' | 'created_at' | 'updated_at'>);
      }
      setEditingId(null);
      setFormData({ title: '', slug: '', excerpt: '', content: '', status: 'published', read_time: 5 });
      loadPosts();
    } catch (err) {
      console.error(err);
      alert('Error saving post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.posts.delete(id);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setFormData(p);
  };

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Blog Manager</h1>
      
      {/* Form Area */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ marginBottom: 16 }}>{editingId ? 'Edit Post' : 'New Post'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <input placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="admin-input" />
          <input placeholder="Slug (e.g. hello-world)" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="admin-input" />
          <input type="number" placeholder="Read Time (min)" value={formData.read_time || 5} onChange={e => setFormData({...formData, read_time: parseInt(e.target.value) || 5})} className="admin-input" />
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Tags / Categories</label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['AI', 'Development', 'UI Design', 'Campus Innovation'].map(tag => (
                <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={(formData.tags || []).includes(tag)}
                    onChange={(e) => {
                      const current = formData.tags || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, tags: [...current, tag] });
                      } else {
                        setFormData({ ...formData, tags: current.filter(t => t !== tag) });
                      }
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Cover Image URL</label>
            <input placeholder="Cover Image URL" value={formData.cover_url || ''} onChange={e => setFormData({...formData, cover_url: e.target.value})} className="admin-input" style={{ marginBottom: 8 }} />
            {formData.cover_url && <img src={formData.cover_url} alt="preview" style={{ height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)', marginBottom: 8 }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    try {
                      const url = await api.storage.uploadImage(e.target.files[0]);
                      setFormData(prev => ({...prev, cover_url: url}));
                    } catch (err) { alert("Upload failed"); }
                  }
                }} 
                style={{ fontSize: '0.8rem' }}
              />
            </div>
          </div>
          
          <textarea placeholder="Excerpt" value={formData.excerpt || ''} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="admin-input" style={{ gridColumn: 'span 2' }} />
          <textarea placeholder="Content (Markdown supported)" value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="admin-input" style={{ gridColumn: 'span 2', minHeight: 200 }} />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={formData.status === 'published'} onChange={e => setFormData({...formData, status: e.target.checked ? 'published' : 'draft'})} /> Published
          </label>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button onClick={handleSave} className="btn-primary">Save Post</button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({ title: '', slug: '', excerpt: '', content: '', status: 'published', read_time: 5 }); }} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      {/* List Area */}
      <div className="glass-card" style={{ padding: 24 }}>
        {loading ? <p>Loading posts...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p style={{ marginBottom: 16 }}>Your database is currently empty.</p>
                    <button 
                      onClick={async () => {
                        const { DEMO_POSTS } = await import('../../lib/data');
                        for (const p of DEMO_POSTS) {
                          await api.posts.create({
                            slug: p.slug,
                            title: p.title,
                            excerpt: p.excerpt,
                            content: p.content,
                            tags: p.tags || [],
                            cover_url: p.cover_url,
                            read_time: 5,
                            status: 'published',
                            category: [],
                            likes: 0,
                            published_at: new Date().toISOString()
                          });
                        }
                        loadPosts();
                      }}
                      className="btn-secondary"
                    >
                      Load Demo Data
                    </button>
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>{p.title}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                      {p.status === 'published' ? <span style={{ color: 'var(--accent-cyan)' }}>Published</span> : <span style={{ color: 'var(--text-secondary)' }}>Draft</span>}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                      <button onClick={() => window.open(`/blog/${p.slug}`, '_blank')} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 10px', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.75rem', marginRight: 6 }}>Preview</button>
                      <button onClick={() => startEdit(p)} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', marginRight: 6 }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: '1px solid #ff4444', borderRadius: 6, padding: '4px 10px', color: '#ff4444', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function MediaLibrary() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await api.storage.listFiles();
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      await api.storage.uploadFile(e.target.files[0]);
      loadFiles();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.storage.deleteFile(filePath);
      loadFiles();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Media Library</h1>
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your public assets.</p>
          <label className="btn-primary" style={{ cursor: 'pointer' }}>
            {uploading ? 'Uploading...' : 'Upload File'}
            <input type="file" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>

        {loading ? <p>Loading media...</p> : files.length === 0 ? <p>No files uploaded yet.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {files.map(file => {
              const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
              return (
                <div key={file.id} className="glass-card" style={{ padding: 8, position: 'relative', overflow: 'hidden' }}>
                  {isImage ? (
                    <img src={file.publicUrl} alt={file.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                  ) : (
                    <div style={{ width: '100%', height: 100, background: 'var(--bg-secondary)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                      📄
                    </div>
                  )}
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>{file.name}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => window.open(file.publicUrl, '_blank')} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 4, padding: '4px', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.65rem' }}>View</button>
                    <button onClick={() => handleDelete(file.filePath)} style={{ flex: 1, background: 'transparent', border: '1px solid #ff4444', borderRadius: 4, padding: '4px', color: '#ff4444', cursor: 'pointer', fontSize: '0.65rem' }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({ title: '', image_url: '', category: '', order_index: 0 });
  
  // Crop states
  const [cropImageFile, setCropImageFile] = useState<File | null>(null);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const [uploadingCrop, setUploadingCrop] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.gallery.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.gallery.update(editingId, formData);
      } else {
        await api.gallery.create(formData as any);
      }
      setEditingId(null);
      setFormData({ title: '', image_url: '', category: '', order_index: 0 });
      loadItems();
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      await api.gallery.delete(id);
      loadItems();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleCropDone = async (croppedBlob: Blob) => {
    setUploadingCrop(true);
    try {
      const file = new File([croppedBlob], cropImageFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
      const url = await api.storage.uploadImage(file);
      setFormData(prev => {
        const currentUrls = prev.image_url ? prev.image_url.split(',').map(s => s.trim()).filter(Boolean) : [];
        return { ...prev, image_url: [...currentUrls, url].join(',') };
      });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed.");
    } finally {
      setUploadingCrop(false);
      setCropImageUrl(null);
      setCropImageFile(null);
    }
  };

  return (
    <div>
      {cropImageUrl && (
        <ImageCropperModal
          imageSrc={cropImageUrl}
          aspectRatio={undefined} // Free form or maybe 4/3? Let's leave undefined to let the user crop freely
          onCropDone={handleCropDone}
          onClose={() => { setCropImageUrl(null); setCropImageFile(null); }}
        />
      )}
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Gallery Manager</h1>
      
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ marginBottom: 16 }}>{editingId ? 'Edit Item' : 'New Item'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <input placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="admin-input" />
          
          <div>
            <select 
              value={formData.category || ''} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="admin-input"
              style={{ width: '100%', appearance: 'auto', background: 'var(--bg-secondary)' }}
            >
              <option value="" disabled>Select Category</option>
              {['UI Designs', 'Project Screenshots', 'Events'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Media (Images or Videos)</label>
            <input placeholder="Media URLs (comma separated)" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} className="admin-input" style={{ marginBottom: 8 }} />
            
            {formData.image_url && (
              <div style={{ marginBottom: 8, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {formData.image_url.split(',').filter(Boolean).map((url, idx) => {
                  const urlStr = url.trim();
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(urlStr.split('?')[0]);
                  return (
                    <div key={idx} style={{ position: 'relative' }}>
                      {isVideo ? (
                        <video src={urlStr} style={{ height: 100, width: 140, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} muted loop playsInline />
                      ) : (
                        <img src={urlStr} alt="preview" style={{ height: 100, width: 140, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} />
                      )}
                      <button 
                        onClick={() => {
                          const urls = formData.image_url!.split(',').map(s => s.trim()).filter(Boolean);
                          urls.splice(idx, 1);
                          setFormData({...formData, image_url: urls.join(',')});
                        }}
                        style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input 
                type="file" 
                accept="image/*,video/mp4,video/webm,video/ogg" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    if (file.type.startsWith('video/')) {
                      setUploadingCrop(true);
                      api.storage.uploadFile(file).then(url => {
                        setFormData(prev => {
                          const currentUrls = prev.image_url ? prev.image_url.split(',').map(s => s.trim()).filter(Boolean) : [];
                          return { ...prev, image_url: [...currentUrls, url].join(',') };
                        });
                      }).catch(err => {
                        console.error(err);
                        alert('Video upload failed');
                      }).finally(() => {
                        setUploadingCrop(false);
                      });
                    } else {
                      setCropImageFile(file);
                      const reader = new FileReader();
                      reader.onload = () => setCropImageUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                    e.target.value = ''; // Reset input
                  }
                }} 
                style={{ fontSize: '0.8rem' }}
                disabled={uploadingCrop}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {uploadingCrop ? 'Uploading...' : 'Or upload and crop a file directly'}
              </span>
            </div>
          </div>
          <input type="number" placeholder="Order Index" value={formData.order_index || 0} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} className="admin-input" />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button onClick={handleSave} className="btn-primary">Save Item</button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({ title: '', image_url: '', category: '', order_index: 0 }); }} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 24 }}>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Image</th>
                <th style={{ textAlign: 'left', padding: '16px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Title / Category</th>
                <th style={{ textAlign: 'left', padding: '16px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                    {(() => {
                      const firstUrl = (item.image_url || '').split(',')[0] || '';
                      const isVid = /\.(mp4|webm|ogg)$/i.test(firstUrl.split('?')[0]);
                      return isVid ? (
                        <video src={firstUrl} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} muted loop playsInline />
                      ) : (
                        <img src={firstUrl} alt={item.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      );
                    })()}
                    {item.image_url && item.image_url.split(',').length > 1 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'block', marginTop: 4 }}>
                        +{item.image_url.split(',').length - 1} more
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.category}</div>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                    <button onClick={() => { setEditingId(item.id); setFormData(item); }} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', marginRight: 6 }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'transparent', border: '1px solid #ff4444', borderRadius: 6, padding: '4px 10px', color: '#ff4444', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function ResumeManager() {
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.settings.getAll().then(settings => {
      const resume = settings.find(s => s.key === 'resume_url');
      if (resume) setResumeUrl(resume.value);
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await api.storage.uploadFile(e.target.files[0], 'portfolio-media', 'resume');
      await api.settings.update('resume_url', url);
      setResumeUrl(url);
      alert('Resume updated successfully!');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Resume Manager</h1>
      <div className="glass-card" style={{ padding: 24 }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Upload your latest PDF resume. This will update the download links across your site.</p>
        
        {resumeUrl && (
          <div style={{ marginBottom: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem' }}>Current Resume Active</span>
            <button onClick={() => window.open(resumeUrl, '_blank')} className="btn-secondary" style={{ padding: '6px 12px' }}>View PDF</button>
          </div>
        )}

        <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
          {uploading ? 'Uploading...' : 'Upload New PDF'}
          <input type="file" accept=".pdf" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await api.messages.getAll();
      setMessages(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadMessages(); }, []);

  const markRead = async (id: string, read: boolean) => {
    try { await api.messages.update(id, { read }); loadMessages(); } catch(err) {}
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this message?')) return;
    try { await api.messages.delete(id); loadMessages(); } catch(err) {}
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Messages</h1>
      <div className="glass-card" style={{ padding: 24 }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{unreadCount} unread, {messages.length - unreadCount} read messages</p>
        {loading ? <p>Loading messages...</p> : messages.length === 0 ? <p>No messages yet.</p> : messages.map((msg) => (
          <div key={msg.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!msg.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-violet)' }} />}
                <p className="font-heading" style={{ fontSize: '0.9rem', fontWeight: msg.read ? 400 : 600 }}>{msg.name}</p>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{msg.subject} — {msg.body}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: 4 }}>{msg.email} • {new Date(msg.created_at).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => markRead(msg.id, !msg.read)} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.7rem' }}>Mark {msg.read ? 'Unread' : 'Read'}</button>
              <button onClick={() => handleDelete(msg.id)} style={{ background: 'transparent', border: '1px solid #ff4444', borderRadius: 6, padding: '4px 8px', color: '#ff4444', cursor: 'pointer', fontSize: '0.7rem' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '', category: '', proficiency: 50, icon_url: '', order_index: 0
  });

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await api.skills.getAll();
      setSkills(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadSkills(); }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.skills.update(editingId, formData);
      } else {
        await api.skills.create(formData as Omit<Skill, 'id' | 'created_at'>);
      }
      setEditingId(null);
      setFormData({ name: '', category: '', proficiency: 50, icon_url: '', order_index: 0 });
      loadSkills();
    } catch (err) { alert('Error saving skill'); }
  };

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Skills Manager</h1>
      
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ marginBottom: 16 }}>{editingId ? 'Edit Skill' : 'New Skill'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <input placeholder="Name (e.g. React)" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="admin-input" />
          <input placeholder="Category (e.g. Frontend)" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="admin-input" />
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Proficiency: {formData.proficiency}%</label>
            <input type="range" min="1" max="100" value={formData.proficiency || 50} onChange={e => setFormData({...formData, proficiency: parseInt(e.target.value)})} style={{ width: '100%', marginTop: 8 }} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Icon Image URL (Optional)</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input placeholder="Icon URL" value={formData.icon_url || ''} onChange={e => setFormData({...formData, icon_url: e.target.value})} className="admin-input" />
              <input type="file" accept="image/*" onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  try {
                    const url = await api.storage.uploadImage(e.target.files[0]);
                    setFormData(prev => ({...prev, icon_url: url}));
                  } catch (err) { alert("Upload failed"); }
                }
              }} />
            </div>
            {formData.icon_url && <img src={formData.icon_url} style={{ height: 40, marginTop: 10 }} alt="icon" />}
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button onClick={handleSave} className="btn-primary">Save Skill</button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({ name: '', category: '', proficiency: 50, icon_url: '', order_index: 0 }); }} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        {loading ? <p>Loading skills...</p> : (
          <div>
            {skills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <p>No skills found.</p>
                <button onClick={async () => {
                  const { DEMO_SKILLS } = await import('../../lib/data');
                  for (const s of DEMO_SKILLS) {
                    await api.skills.create({ name: s.name, category: s.category, proficiency: s.proficiency, order_index: s.order_index || 0 });
                  }
                  loadSkills();
                }} className="btn-secondary" style={{ marginTop: 12 }}>Load Demo Data</button>
              </div>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ flex: 1 }}>
                    <span className="font-heading" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{skill.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: 12 }}>{skill.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-violet)' }}>{skill.proficiency}%</span>
                    <button onClick={() => { setEditingId(skill.id); setFormData(skill); }} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem' }}>Edit</button>
                    <button onClick={async () => { if(confirm('Delete?')) { await api.skills.delete(skill.id); loadSkills(); } }} style={{ background: 'transparent', border: '1px solid #ff4444', borderRadius: 6, padding: '4px 10px', color: '#ff4444', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExperienceManager() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Experience>>({
    title: '', org: '', start_date: '', end_date: '', current: true, description: '', order_index: 0, tags: [], type: 'work'
  });

  const loadExperience = async () => {
    setLoading(true);
    try {
      const data = await api.experience.getAll();
      setExperience(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadExperience(); }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.experience.update(editingId, formData);
      } else {
        await api.experience.create(formData as Omit<Experience, 'id' | 'created_at'>);
      }
      setEditingId(null);
      setFormData({ title: '', org: '', start_date: '', end_date: '', current: true, description: '', order_index: 0, tags: [], type: 'work' });
      loadExperience();
    } catch (err) { alert('Error saving experience'); }
  };

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Experience Manager</h1>
      
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ marginBottom: 16 }}>{editingId ? 'Edit Experience' : 'New Experience'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <input placeholder="Title / Role" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="admin-input" />
          <input placeholder="Organization / Company" value={formData.org || ''} onChange={e => setFormData({...formData, org: e.target.value})} className="admin-input" />
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
            <input placeholder="React, Node.js, Leadership" value={(formData.tags || []).join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="admin-input" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <input type="checkbox" checked={formData.current || false} onChange={e => setFormData({...formData, current: e.target.checked})} /> Currently working here
          </label>
          <input placeholder="Start Date (e.g. 2021)" value={formData.start_date || ''} onChange={e => setFormData({...formData, start_date: e.target.value})} className="admin-input" />
          <input placeholder="End Date (e.g. 2023)" value={formData.end_date || ''} onChange={e => setFormData({...formData, end_date: e.target.value})} className="admin-input" disabled={formData.current} style={{ opacity: formData.current ? 0.5 : 1 }} />
          <select value={formData.type || 'work'} onChange={e => setFormData({...formData, type: e.target.value as any})} className="admin-input" style={{ gridColumn: 'span 2' }}>
            <option value="work">Work Experience</option>
            <option value="project">Project Experience</option>
            <option value="freelance">Freelance</option>
            <option value="achievement">Achievement</option>
          </select>
          <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="admin-input" style={{ gridColumn: 'span 2' }} />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button onClick={handleSave} className="btn-primary">Save Experience</button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({ title: '', org: '', start_date: '', end_date: '', current: true, description: '', order_index: 0, tags: [], type: 'work' }); }} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        {loading ? <p>Loading experience...</p> : (
          <div>
            {experience.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <p>No experience found.</p>
                <button onClick={async () => {
                  const { DEMO_EXPERIENCE } = await import('../../lib/data');
                  for (const exp of DEMO_EXPERIENCE) {
                    await api.experience.create({
                      title: exp.title,
                      org: exp.org,
                      start_date: exp.start_date,
                      end_date: exp.end_date || '',
                      current: exp.current,
                      description: exp.description,
                      type: exp.type || 'work',
                      tags: exp.tags || [],
                      order_index: exp.order_index || 0
                    });
                  }
                  loadExperience();
                }} className="btn-secondary" style={{ marginTop: 12 }}>Load Demo Data</button>
              </div>
            ) : (
              experience.map((exp) => (
                <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ flex: 1 }}>
                    <span className="font-heading" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{exp.title}</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 4 }}>{exp.org} ({exp.start_date} - {exp.current ? 'Present' : exp.end_date})</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => { setEditingId(exp.id); setFormData(exp); }} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem' }}>Edit</button>
                    <button onClick={async () => { if(confirm('Delete?')) { await api.experience.delete(exp.id); loadExperience(); } }} style={{ background: 'transparent', border: '1px solid #ff4444', borderRadius: 6, padding: '4px 10px', color: '#ff4444', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({
    building_status: 'Smart Campus AI Platform',
    social_github: 'https://github.com/manthanpatel',
    social_linkedin: 'https://linkedin.com/in/manthanpatel',
    social_instagram: 'https://instagram.com/manthanpatel',
    social_x: 'https://x.com/manthanpatel',
    social_email: 'manthan@example.com',
    bg_video_dark: '',
    bg_video_light: '',
    profile_image_url: '',
    show_resume_section: 'true',
    about_text: "I'm a full-stack developer passionate about building scalable AI applications and interactive web experiences. With expertise in React, Node.js, and modern cloud architecture, I love turning complex problems into elegant solutions.",
    ai_context: 'Currently working on Smart Campus AI Platform. Available for freelance React/AI projects. Based in Hubli, Karnataka, India.',
    about_stats: JSON.stringify([
      { label: 'Hours Coded', value: 1200, suffix: '+' },
      { label: 'Projects Built', value: 12, suffix: '' },
      { label: 'Bugs Squashed', value: 300, suffix: '+' },
      { label: 'APIs Integrated', value: 25, suffix: '+' },
    ]),
    achievements: JSON.stringify([
      { icon: '🏆', title: 'Built First Full Stack App', description: 'Shipped a complete web application with frontend, backend, and database — from scratch.' },
      { icon: '🤖', title: 'Integrated AI APIs', description: 'Connected Claude, OpenAI, and custom ML models to production applications.' },
      { icon: '📊', title: 'Built Real-time Dashboard', description: 'Created live-updating analytics dashboards with WebSocket and Supabase Realtime.' },
      { icon: '🥇', title: 'Hackathon Winner', description: 'Won a campus-wide hackathon with the Smart Campus Sustainability System.' },
      { icon: '🚀', title: 'Shipped 10+ Apps', description: 'Delivered over 10 production-ready applications for clients and personal projects.' },
      { icon: '📦', title: 'Open Source Contributor', description: 'Contributed to popular open source projects and shared my own tools with the community.' }
    ])
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.settings.getAll().then(data => {
      if (data.length > 0) {
        const obj: Record<string, string> = {};
        data.forEach(s => obj[s.key] = s.value);
        setSettings(prev => ({ ...prev, ...obj }));
      }
    });
  }, []);

  const handleChange = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const key of Object.keys(settings)) {
        await api.settings.update(key, settings[key]);
      }
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Site Settings</h1>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Currently Building Status</h2>
        <input
          type="text"
          value={settings.building_status}
          onChange={e => handleChange('building_status', e.target.value)}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', marginBottom: 16 }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <input
            type="checkbox"
            id="show_resume_section"
            checked={settings.show_resume_section !== 'false'}
            onChange={e => handleChange('show_resume_section', e.target.checked ? 'true' : 'false')}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="show_resume_section" className="font-heading" style={{ fontSize: '1rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
            Show Resume Section on Public Site
          </label>
        </div>
        
        <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Profile Image URL</h2>
        <input
          type="text"
          value={settings.profile_image_url || ''}
          onChange={e => handleChange('profile_image_url', e.target.value)}
          placeholder="e.g. https://your-supabase-url.com/.../profile.jpg"
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
        />
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Background Video URLs (Optional)</h2>
        
        <div style={{ marginBottom: 12 }}>
          <label className="font-heading" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Dark Mode Video URL (MP4)</label>
          <input
            type="text"
            value={settings.bg_video_dark || ''}
            onChange={e => handleChange('bg_video_dark', e.target.value)}
            placeholder="e.g. https://cdn.pixabay.com/.../dark_bg.mp4"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label className="font-heading" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Light Mode Video URL (MP4)</label>
          <input
            type="text"
            value={settings.bg_video_light || ''}
            onChange={e => handleChange('bg_video_light', e.target.value)}
            placeholder="e.g. https://cdn.pixabay.com/.../light_bg.mp4"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Social Media URLs</h2>
        {['github', 'linkedin', 'instagram', 'x', 'email'].map((platform) => (
          <div key={platform} style={{ marginBottom: 12 }}>
            <label className="font-heading" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>{platform}</label>
            <input
              type="text"
              value={settings[`social_${platform}`]}
              onChange={e => handleChange(`social_${platform}`, e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>About Me Text</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12 }}>This text is displayed in the About Me section.</p>
        <textarea
          rows={6}
          value={settings.about_text}
          onChange={e => handleChange('about_text', e.target.value)}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
        />
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>AI Chat Context</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12 }}>This text is appended to the AI assistant's knowledge base.</p>
        <textarea
          rows={6}
          value={settings.ai_context}
          onChange={e => handleChange('ai_context', e.target.value)}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
        />
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600 }}>By The Numbers (About Stats)</h2>
          <button onClick={() => {
            try {
              const current = JSON.parse(settings.about_stats);
              handleChange('about_stats', JSON.stringify([...current, { label: 'New Stat', value: 0, suffix: '' }]));
            } catch(e) {}
          }} style={{ background: 'transparent', border: '1px solid var(--accent-violet)', borderRadius: 6, padding: '4px 10px', color: 'var(--accent-violet)', cursor: 'pointer', fontSize: '0.75rem' }}>+ Add Stat</button>
        </div>
        
        {(() => {
          let stats = [];
          try { stats = JSON.parse(settings.about_stats); } catch(e) { return <p>Invalid stats data</p>; }
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.map((stat: any, index: number) => (
                <div key={index} style={{ display: 'flex', gap: 12 }}>
                  <input type="text" value={stat.label} onChange={e => {
                    const s = [...stats]; s[index].label = e.target.value; handleChange('about_stats', JSON.stringify(s));
                  }} placeholder="Label (e.g. Hours Coded)" style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                  
                  <input type="number" value={stat.value} onChange={e => {
                    const s = [...stats]; s[index].value = parseInt(e.target.value) || 0; handleChange('about_stats', JSON.stringify(s));
                  }} placeholder="Value (e.g. 1200)" style={{ width: 100, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                  
                  <input type="text" value={stat.suffix} onChange={e => {
                    const s = [...stats]; s[index].suffix = e.target.value; handleChange('about_stats', JSON.stringify(s));
                  }} placeholder="Suffix (e.g. +)" style={{ width: 80, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                  
                  <button onClick={() => {
                    const s = [...stats]; s.splice(index, 1); handleChange('about_stats', JSON.stringify(s));
                  }} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1rem', padding: '0 8px' }}>×</button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600 }}>Achievement Unlocks 🏆</h2>
          <button onClick={() => {
            try {
              const current = JSON.parse(settings.achievements || '[]');
              handleChange('achievements', JSON.stringify([...current, { icon: '⭐', title: 'New Achievement', description: '' }]));
            } catch(e) {}
          }} style={{ background: 'transparent', border: '1px solid var(--accent-violet)', borderRadius: 6, padding: '4px 10px', color: 'var(--accent-violet)', cursor: 'pointer', fontSize: '0.75rem' }}>+ Add Achievement</button>
        </div>
        
        {(() => {
          let achievements = [];
          try { achievements = JSON.parse(settings.achievements || '[]'); } catch(e) { return <p>Invalid achievements data</p>; }
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {achievements.map((ach: any, index: number) => (
                <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <input type="text" value={ach.icon} onChange={e => {
                    const a = [...achievements]; a[index].icon = e.target.value; handleChange('achievements', JSON.stringify(a));
                  }} placeholder="Icon (e.g. 🏆)" style={{ width: 60, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', textAlign: 'center' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <input type="text" value={ach.title} onChange={e => {
                      const a = [...achievements]; a[index].title = e.target.value; handleChange('achievements', JSON.stringify(a));
                    }} placeholder="Title" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                    
                    <textarea value={ach.description} onChange={e => {
                      const a = [...achievements]; a[index].description = e.target.value; handleChange('achievements', JSON.stringify(a));
                    }} placeholder="Description" rows={2} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
                  </div>
                  
                  <button onClick={() => {
                    const a = [...achievements]; a.splice(index, 1); handleChange('achievements', JSON.stringify(a));
                  }} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1rem', padding: '8px', height: 36 }}>×</button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ marginTop: 24 }}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
