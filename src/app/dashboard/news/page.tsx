'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  getNewsPosts,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
} from '@/lib/firestore/news';
import { NewsPost } from '@/types';
import styles from './page.module.scss';

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: '',
  category: '',
  isPublished: false,
};

export default function NewsDashboardPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getNewsPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (p: NewsPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      content: p.content,
      coverImage: p.coverImage || '',
      author: p.author || '',
      category: p.category || '',
      isPublished: p.isPublished,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news post?')) return;
    await deleteNewsPost(id);
    toast.success('News post deleted');
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-');
      const payload = { ...form, slug } as Partial<NewsPost>;
      if (editing) {
        await updateNewsPost(editing.id, payload);
        toast.success('News post updated');
      } else {
        await createNewsPost({ ...payload, id: uuidv4() } as NewsPost);
        toast.success('News post created');
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
          <h1>News</h1>
          <p>{posts.length} article{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}><FiPlus /> Add Article</button>
      </div>

      {loading ? (
        <div className={styles.loading}><span className="spinner" /></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {posts.length === 0 && <div className={styles.empty}>No news articles yet.</div>}
          {posts.map(p => (
            <div key={p.id} className={styles.tableRow}>
              <span className={styles.title}>{p.title}</span>
              <span>{p.category || '—'}</span>
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
              <h2>{editing ? 'Edit Article' : 'New Article'}</h2>
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
                  <label>Category</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Company News, Updates..." />
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
