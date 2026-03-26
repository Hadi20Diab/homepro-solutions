'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '@/lib/firestore/services';
import { Service } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import styles from './page.module.scss';

const emptyForm: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  icon: '',
  image: '',
  features: [],
  isActive: true,
  order: 0,
};

export default function ServicesDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [featuresInput, setFeaturesInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setFeaturesInput('');
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      slug: s.slug,
      description: s.description,
      shortDescription: s.shortDescription || '',
      icon: s.icon || '',
      image: s.image || '',
      features: s.features || [],
      isActive: s.isActive,
      order: s.order || 0,
    });
    setFeaturesInput((s.features || []).join('\n'));
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await deleteService(id);
    toast.success('Service deleted');
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const features = featuresInput.split('\n').map(f => f.trim()).filter(Boolean);
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-');
      if (editing) {
        await updateService(editing.id, { ...form, slug, features });
        toast.success('Service updated');
      } else {
        await createService({ ...form, slug, features, id: uuidv4() } as Service);
        toast.success('Service created');
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
          <h1>Services</h1>
          <p>{services.length} service{services.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          <FiPlus /> Add Service
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}><span className="spinner" /></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Title</span>
            <span>Slug</span>
            <span>Status</span>
            <span>Order</span>
            <span>Actions</span>
          </div>
          {services.length === 0 && (
            <div className={styles.empty}>No services yet. Click "Add Service" to get started.</div>
          )}
          {services.map(s => (
            <div key={s.id} className={styles.tableRow}>
              <span className={styles.title}>{s.title}</span>
              <span className={styles.slug}>{s.slug}</span>
              <span>
                <span className={`${styles.badge} ${s.isActive ? styles.active : styles.inactive}`}>
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
              </span>
              <span>{s.order ?? 0}</span>
              <div className={styles.actions}>
                <button onClick={() => openEdit(s)} title="Edit"><FiEdit2 /></button>
                <button onClick={() => handleDelete(s.id)} title="Delete" className={styles.danger}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className="form-group">
                  <label>Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Plumbing Services" />
                </div>
                <div className="form-group">
                  <label>Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" />
                </div>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief summary..." />
              </div>
              <div className="form-group">
                <label>Full Description *</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed description..." />
              </div>
              <div className={styles.row}>
                <div className="form-group">
                  <label>Icon (react-icon name)</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="FiDroplet" />
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group">
                <ImageUpload
                  label="Service Image (optional)"
                  value={form.image ?? ''}
                  onChange={url => setForm({ ...form, image: url })}
                  folder="services"
                />
              </div>
              <div className="form-group">
                <label>Features (one per line)</label>
                <textarea rows={4} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder="24/7 emergency service&#10;Licensed plumbers&#10;Free estimates" />
              </div>
              <div className={styles.checkRow}>
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
