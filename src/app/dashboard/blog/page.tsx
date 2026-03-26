'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/lib/firestore/blog';
import { BlogPost } from '@/types';
import styles from './page.module.scss';

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: '',
  tags: [] as string[],
  isPublished: false,
};

export default function BlogDashboardPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setTagsInput('');
    setShowModal(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      content: p.content,
      coverImage: p.coverImage || '',
      author: p.author || '',
      tags: p.tags || [],
      isPublished: p.isPublished,
    });
    setTagsInput((p.tags || []).join(', '));
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await deleteBlogPost(id);
    toast.success('Blog post deleted');
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-');
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { ...form, slug, tags } as Partial<BlogPost>;
      if (editing) {
        await updateBlogPost(editing.id, payload);
        toast.success('Blog post updated');
      } else {
        await createBlogPost({ ...payload, id: uuidv4() } as BlogPost);
        toast.success('Blog post created');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (ts: unknown) => {
    if (!ts) return '—';
    const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
    return d.toLocaleDateString();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Blog Posts</h1>
          <p>{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}><FiPlus /> Add Post</button>
      </div>

      {loading ? (
        <div className={styles.loading}><span className="spinner" /></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Title</span>
            <span>Author</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {posts.length === 0 && <div className={styles.empty}>No blog posts yet.</div>}
          {posts.map(p => (
            <div key={p.id} className={styles.tableRow}>
              <span className={styles.title}>{p.title}</span>
              <span>{p.author || '—'}</span>
              <span>
                <span className={`${styles.badge} ${p.isPublished ? styles.active : styles.inactive}`}>
                  {p.isPublished ? 'Published' : 'Draft'}
                </span>
              </span>
              <span>{formatDate(p.createdAt)}</span>
              <div className={styles.actions}>
                <button onClick={() => openEdit(p)} title="Edit"><FiEdit2 /></button>
                <button onClick={() => handleDelete(p.id)} title="Delete" className={styles.danger}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className="form-group">
                  <label>Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
                </div>
              </div>
              <div className={styles.row}>
                <div className="form-group">
                  <label>Author</label>
                  <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="plumbing, tips, DIY" />
                </div>
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Content (HTML supported) *</label>
                <textarea required rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className={styles.checkRow}>
                <label>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                  Published (visible on website)
                </label>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? 'Saving…' : <><FiCheck /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
