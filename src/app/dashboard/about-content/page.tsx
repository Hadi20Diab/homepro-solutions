'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getAboutContent, setAboutContent } from '@/lib/firestore/siteContent';
import { AboutContent } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import styles from './page.module.scss';

const defaultContent: AboutContent = {
  heroTitle: 'About HomePro Solutions',
  heroSubtitle: 'Your trusted partner for all home maintenance needs since 2009.',
  story: 'HomePro Solutions was founded with a simple mission...',
  mission: 'To provide reliable, high-quality home maintenance services.',
  vision: 'To be the most trusted home services company in the region.',
  teamMembers: [],
  values: [
    { title: 'Integrity', description: 'We do what we say and say what we do.' },
    { title: 'Excellence', description: 'We hold our work to the highest standards.' },
  ],
};

export default function AboutContentPage() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'hero' | 'story' | 'values' | 'team'>('hero');

  useEffect(() => {
    getAboutContent().then(data => {
      if (data) setContent(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setAboutContent(content);
      toast.success('About content saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => setContent(c => ({ ...c, values: [...c.values, { title: '', description: '' }] }));
  const removeValue = (i: number) => setContent(c => ({ ...c, values: c.values.filter((_, idx) => idx !== i) }));
  const updateValue = (i: number, field: 'title' | 'description', val: string) =>
    setContent(c => ({ ...c, values: c.values.map((v, idx) => idx === i ? { ...v, [field]: val } : v) }));

  const addMember = () => setContent(c => ({ ...c, teamMembers: [...c.teamMembers, { name: '', role: '', image: '', bio: '' }] }));
  const removeMember = (i: number) => setContent(c => ({ ...c, teamMembers: c.teamMembers.filter((_, idx) => idx !== i) }));
  const updateMember = (i: number, field: keyof typeof content.teamMembers[0], val: string) =>
    setContent(c => ({ ...c, teamMembers: c.teamMembers.map((m, idx) => idx === i ? { ...m, [field]: val } : m) }));

  if (loading) return <div className={styles.page}><div className={styles.loading}><span className="spinner" /></div></div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>About Page Content</h1>
          <p>Edit the content displayed on the about page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
          {saving ? 'Saving…' : <><FiSave /> Save Changes</>}
        </button>
      </div>

      <div className={styles.tabs}>
        {(['hero', 'story', 'values', 'team'] as const).map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
            {t === 'hero' ? 'Hero' : t === 'story' ? 'Story & Mission' : t === 'values' ? 'Core Values' : 'Team'}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {tab === 'hero' && (
          <div className={styles.section}>
            <h3>Hero Section</h3>
            <div className="form-group">
              <label>Page Title</label>
              <input value={content.heroTitle} onChange={e => setContent(c => ({ ...c, heroTitle: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Sub-title</label>
              <input value={content.heroSubtitle} onChange={e => setContent(c => ({ ...c, heroSubtitle: e.target.value }))} />
            </div>
          </div>
        )}

        {tab === 'story' && (
          <div className={styles.section}>
            <h3>Story & Mission</h3>
            <div className="form-group">
              <label>Our Story</label>
              <textarea rows={6} value={content.story} onChange={e => setContent(c => ({ ...c, story: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Mission Statement</label>
              <textarea rows={3} value={content.mission} onChange={e => setContent(c => ({ ...c, mission: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Vision Statement</label>
              <textarea rows={3} value={content.vision} onChange={e => setContent(c => ({ ...c, vision: e.target.value }))} />
            </div>
          </div>
        )}

        {tab === 'values' && (
          <div className={styles.section}>
            <h3>Core Values</h3>
            <div className={styles.listSection}>
              <div className={styles.listHeader}>
                <span>{content.values.length} value{content.values.length !== 1 ? 's' : ''}</span>
                <button onClick={addValue} className={styles.addSmallBtn}><FiPlus /> Add Value</button>
              </div>
              {content.values.map((v, i) => (
                <div key={i} className={styles.listItem}>
                  <div className="form-group">
                    <label>Title</label>
                    <input value={v.title} onChange={e => updateValue(i, 'title', e.target.value)} placeholder="Integrity" />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Description</label>
                    <input value={v.description} onChange={e => updateValue(i, 'description', e.target.value)} placeholder="We do what we say..." />
                  </div>
                  <button onClick={() => removeValue(i)} className={styles.removeBtn}><FiTrash2 /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'team' && (
          <div className={styles.section}>
            <h3>Team Members</h3>
            <div className={styles.listSection}>
              <div className={styles.listHeader}>
                <span>{content.teamMembers.length} member{content.teamMembers.length !== 1 ? 's' : ''}</span>
                <button onClick={addMember} className={styles.addSmallBtn}><FiPlus /> Add Member</button>
              </div>
              {content.teamMembers.map((m, i) => (
                <div key={i} className={styles.memberItem}>
                  <div className={styles.row}>
                    <div className="form-group">
                      <label>Name</label>
                      <input value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Role / Title</label>
                      <input value={m.role} onChange={e => updateMember(i, 'role', e.target.value)} placeholder="Senior Plumber" />
                    </div>
                  </div>
                  <div className="form-group">
                    <ImageUpload
                      label="Photo"
                      value={m.image}
                      onChange={url => updateMember(i, 'image', url)}
                      folder="about"
                    />
                  </div>
                  <div className="form-group">
                    <label>Short Bio</label>
                    <textarea rows={2} value={m.bio} onChange={e => updateMember(i, 'bio', e.target.value)} />
                  </div>
                  <button onClick={() => removeMember(i)} className={styles.removeBtn}><FiTrash2 /> Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
