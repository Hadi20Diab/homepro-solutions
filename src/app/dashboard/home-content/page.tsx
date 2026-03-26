'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiCheck, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getHomeContent, setHomeContent } from '@/lib/firestore/siteContent';
import { HomeContent } from '@/types';
import styles from './page.module.scss';

const defaultContent: HomeContent = {
  hero: {
    headline: 'Your Trusted Home Maintenance Partner',
    subheadline: 'Professional plumbing, electrical, AC repair, and more — available 24/7.',
    ctaText: 'Request a Service',
    ctaLink: '/contact',
    backgroundImage: '',
  },
  statsTitle: 'Trusted by Thousands',
  stats: [
    { label: 'Happy Clients', value: '2400+' },
    { label: 'Jobs Completed', value: '8500+' },
    { label: 'Customer Rating', value: '4.9/5' },
    { label: 'Years of Experience', value: '15+' },
  ],
  whyUsTitle: 'Why Choose HomePro Solutions?',
  whyUsPoints: [
    { title: 'Licensed & Insured', description: 'All our technicians are fully licensed.', icon: 'FiShield' },
    { title: '24/7 Availability', description: 'We are available around the clock.', icon: 'FiClock' },
  ],
  ctaBannerTitle: 'Ready to Get Started?',
  ctaBannerSubtitle: 'Contact us today for a free estimate.',
};

export default function HomeContentPage() {
  const [content, setContent] = useState<HomeContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'hero' | 'stats' | 'whyus' | 'cta'>('hero');

  useEffect(() => {
    getHomeContent().then(data => {
      if (data) setContent(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setHomeContent(content);
      toast.success('Home content saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => setContent(c => ({ ...c, stats: [...c.stats, { label: '', value: '' }] }));
  const removeStat = (i: number) => setContent(c => ({ ...c, stats: c.stats.filter((_, idx) => idx !== i) }));
  const updateStat = (i: number, field: 'label' | 'value', val: string) =>
    setContent(c => ({ ...c, stats: c.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

  const addPoint = () => setContent(c => ({ ...c, whyUsPoints: [...c.whyUsPoints, { title: '', description: '', icon: '' }] }));
  const removePoint = (i: number) => setContent(c => ({ ...c, whyUsPoints: c.whyUsPoints.filter((_, idx) => idx !== i) }));
  const updatePoint = (i: number, field: keyof typeof content.whyUsPoints[0], val: string) =>
    setContent(c => ({ ...c, whyUsPoints: c.whyUsPoints.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));

  if (loading) return <div className={styles.page}><div className={styles.loading}><span className="spinner" /></div></div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Home Page Content</h1>
          <p>Edit the content displayed on the home page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
          {saving ? 'Saving…' : <><FiSave /> Save Changes</>}
        </button>
      </div>

      <div className={styles.tabs}>
        {(['hero', 'stats', 'whyus', 'cta'] as const).map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
            {t === 'hero' ? 'Hero Section' : t === 'stats' ? 'Stats' : t === 'whyus' ? 'Why Us' : 'CTA Banner'}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {tab === 'hero' && (
          <div className={styles.section}>
            <h3>Hero Section</h3>
            <div className="form-group">
              <label>Headline</label>
              <input value={content.hero.headline} onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, headline: e.target.value } }))} />
            </div>
            <div className="form-group">
              <label>Sub-headline</label>
              <textarea rows={3} value={content.hero.subheadline} onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, subheadline: e.target.value } }))} />
            </div>
            <div className={styles.row}>
              <div className="form-group">
                <label>CTA Button Text</label>
                <input value={content.hero.ctaText} onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, ctaText: e.target.value } }))} />
              </div>
              <div className="form-group">
                <label>CTA Button Link</label>
                <input value={content.hero.ctaLink} onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, ctaLink: e.target.value } }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Background Image URL</label>
              <input value={content.hero.backgroundImage} onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, backgroundImage: e.target.value } }))} placeholder="https://..." />
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className={styles.section}>
            <h3>Stats Section</h3>
            <div className="form-group">
              <label>Section Title</label>
              <input value={content.statsTitle} onChange={e => setContent(c => ({ ...c, statsTitle: e.target.value }))} />
            </div>
            <div className={styles.listSection}>
              <div className={styles.listHeader}>
                <span>Stats</span>
                <button onClick={addStat} className={styles.addSmallBtn}><FiPlus /> Add Stat</button>
              </div>
              {content.stats.map((s, i) => (
                <div key={i} className={styles.listItem}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Value</label>
                    <input value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="2400+" />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Label</label>
                    <input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Happy Clients" />
                  </div>
                  <button onClick={() => removeStat(i)} className={styles.removeBtn}><FiTrash2 /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'whyus' && (
          <div className={styles.section}>
            <h3>Why Us Section</h3>
            <div className="form-group">
              <label>Section Title</label>
              <input value={content.whyUsTitle} onChange={e => setContent(c => ({ ...c, whyUsTitle: e.target.value }))} />
            </div>
            <div className={styles.listSection}>
              <div className={styles.listHeader}>
                <span>Points</span>
                <button onClick={addPoint} className={styles.addSmallBtn}><FiPlus /> Add Point</button>
              </div>
              {content.whyUsPoints.map((p, i) => (
                <div key={i} className={styles.pointItem}>
                  <div className={styles.row}>
                    <div className="form-group">
                      <label>Title</label>
                      <input value={p.title} onChange={e => updatePoint(i, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Icon (react-icon name)</label>
                      <input value={p.icon} onChange={e => updatePoint(i, 'icon', e.target.value)} placeholder="FiShield" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input value={p.description} onChange={e => updatePoint(i, 'description', e.target.value)} />
                  </div>
                  <button onClick={() => removePoint(i)} className={styles.removeBtn}><FiTrash2 /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'cta' && (
          <div className={styles.section}>
            <h3>CTA Banner</h3>
            <div className="form-group">
              <label>Title</label>
              <input value={content.ctaBannerTitle} onChange={e => setContent(c => ({ ...c, ctaBannerTitle: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <input value={content.ctaBannerSubtitle} onChange={e => setContent(c => ({ ...c, ctaBannerSubtitle: e.target.value }))} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
