'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/firestore/projects';
import { Project } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import styles from './page.module.scss';

const CATEGORIES = ['Plumbing', 'Electrical', 'AC Repair', 'Cleaning', 'Renovation', 'Other'];

const emptyForm = {
  title: '',
  slug: '',
  category: '',
  description: '',
  shortDescription: '',
  beforeImages: [] as string[],
  afterImages: [] as string[],
  completionDate: '',
  isFeatured: false,
  isActive: true,
};

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      category: p.category || '',
      description: p.description,
      shortDescription: p.shortDescription || '',
      beforeImages: p.beforeImages || [],
      afterImages: p.afterImages || [],
      completionDate: p.completionDate || '',
      isFeatured: p.isFeatured || false,
      isActive: p.isActive !== false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    toast.success('Project deleted');
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-');
      const payload = { ...form, slug } as Partial<Project>;
      if (editing) {
        await updateProject(editing.id, payload);
        toast.success('Project updated');
      } else {
        await createProject({ ...payload, id: uuidv4() } as Project);
        toast.success('Project created');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Projects</h1>
          <p>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          <FiPlus /> Add Project
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}><span className="spinner" /></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Featured</span>
            <span>Actions</span>
          </div>
          {projects.length === 0 && (
            <div className={styles.empty}>No projects yet.</div>
          )}
          {projects.map(p => (
            <div key={p.id} className={styles.tableRow}>
              <span className={styles.title}>{p.title}</span>
              <span><span className={styles.tag}>{p.category || '—'}</span></span>
              <span>
                <span className={`${styles.badge} ${p.isActive !== false ? styles.active : styles.inactive}`}>
                  {p.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </span>
              <span>{p.isFeatured ? '★ Yes' : '—'}</span>
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
              <h2>{editing ? 'Edit Project' : 'Add Project'}</h2>
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
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Completion Date</label>
                  <input type="date" value={form.completionDate} onChange={e => setForm({ ...form, completionDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Full Description *</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className={styles.row}>
                <div className="form-group">
                  <label><FiImage style={{ marginRight: 4 }} />Before Images</label>
                  {form.beforeImages.map((url, idx) => (
                    <div key={idx} className={styles.imageSlot}>
                      <ImageUpload
                        value={url}
                        onChange={newUrl => {
                          const arr = [...form.beforeImages];
                          arr[idx] = newUrl;
                          setForm({ ...form, beforeImages: arr });
                        }}
                        folder="projects"
                      />
                      <button
                        type="button"
                        className={styles.removeImgBtn}
                        onClick={() => setForm({ ...form, beforeImages: form.beforeImages.filter((_, i) => i !== idx) })}
                      >Remove</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addImgBtn}
                    onClick={() => setForm({ ...form, beforeImages: [...form.beforeImages, ''] })}
                  ><FiPlus /> Add Before Image</button>
                </div>
                <div className="form-group">
                  <label><FiImage style={{ marginRight: 4 }} />After Images</label>
                  {form.afterImages.map((url, idx) => (
                    <div key={idx} className={styles.imageSlot}>
                      <ImageUpload
                        value={url}
                        onChange={newUrl => {
                          const arr = [...form.afterImages];
                          arr[idx] = newUrl;
                          setForm({ ...form, afterImages: arr });
                        }}
                        folder="projects"
                      />
                      <button
                        type="button"
                        className={styles.removeImgBtn}
                        onClick={() => setForm({ ...form, afterImages: form.afterImages.filter((_, i) => i !== idx) })}
                      >Remove</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addImgBtn}
                    onClick={() => setForm({ ...form, afterImages: [...form.afterImages, ''] })}
                  ><FiPlus /> Add After Image</button>
                </div>
              </div>
              <div className={styles.checkRow}>
                <label>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                  Featured project
                </label>
                <label>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  Active (visible on website)
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
