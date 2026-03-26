'use client';

import { useEffect, useState } from 'react';
import { FiTrash2, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  getContactSubmissions,
  markContactRead,
  deleteContactSubmission,
} from '@/lib/firestore/contacts';
import { ContactSubmission } from '@/types';
import styles from './page.module.scss';

export default function ContactsDashboardPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getContactSubmissions();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleView = async (c: ContactSubmission) => {
    setSelected(c);
    if (!c.read) {
      await markContactRead(c.id);
      setContacts(prev => prev.map(x => x.id === c.id ? { ...x, read: true } : x));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact submission?')) return;
    await deleteContactSubmission(id);
    toast.success('Deleted');
    if (selected?.id === id) setSelected(null);
    load();
  };

  const formatDate = (ts: unknown) => {
    if (!ts) return '—';
    const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
    return d.toLocaleString();
  };

  const unread = contacts.filter(c => !c.read).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Contact Submissions</h1>
          <p>{contacts.length} total{unread > 0 ? ` · ${unread} unread` : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}><span className="spinner" /></div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.list}>
            {contacts.length === 0 && (
              <div className={styles.empty}>No contact submissions yet.</div>
            )}
            {contacts.map(c => (
              <div
                key={c.id}
                className={`${styles.item} ${!c.read ? styles.unread : ''} ${selected?.id === c.id ? styles.selected : ''}`}
                onClick={() => handleView(c)}
              >
                <div className={styles.itemIcon}>
                  <FiMail />
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemName}>{c.name}</div>
                  <div className={styles.itemEmail}>{c.email}</div>
                  <div className={styles.itemSubject}>{c.subject || c.service || 'General Inquiry'}</div>
                </div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemDate}>{formatDate(c.createdAt)}</span>
                  {!c.read && <span className={styles.dot} />}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.detail}>
            {!selected ? (
              <div className={styles.noSelect}>
                <FiMail size={48} />
                <p>Select a message to read</p>
              </div>
            ) : (
              <>
                <div className={styles.detailHeader}>
                  <div>
                    <h2>{selected.subject || 'General Inquiry'}</h2>
                    <p>From <strong>{selected.name}</strong> · {selected.email}</p>
                    {selected.phone && <p>Phone: {selected.phone}</p>}
                    {selected.service && <p>Service: {selected.service}</p>}
                    <small>{formatDate(selected.createdAt)}</small>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className={styles.deleteBtn}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className={styles.message}>{selected.message}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
