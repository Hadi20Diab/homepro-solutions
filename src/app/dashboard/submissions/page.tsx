'use client';

import { useEffect, useState } from 'react';
import { FiTrash2, FiInbox, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  getProjectSubmissions,
  markProjectSubmissionRead,
  deleteProjectSubmission,
} from '@/lib/firestore/projects';
import { ProjectSubmission } from '@/types';
import styles from './page.module.scss';

export default function SubmissionsDashboardPage() {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProjectSubmission | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getProjectSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleView = async (s: ProjectSubmission) => {
    setSelected(s);
    if (!s.read) {
      await markProjectSubmissionRead(s.id);
      setSubmissions(prev => prev.map(x => x.id === s.id ? { ...x, read: true } : x));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    await deleteProjectSubmission(id);
    toast.success('Submission deleted');
    if (selected?.id === id) setSelected(null);
    load();
  };

  const formatDate = (ts: unknown) => {
    if (!ts) return '—';
    const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
    return d.toLocaleString();
  };

  const unread = submissions.filter(s => !s.read).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Project Submissions</h1>
          <p>{submissions.length} total{unread > 0 ? ` · ${unread} unread` : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}><span className="spinner" /></div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.list}>
            {submissions.length === 0 && (
              <div className={styles.empty}>No project interest submissions yet.</div>
            )}
            {submissions.map(s => (
              <div
                key={s.id}
                className={`${styles.item} ${!s.read ? styles.unread : ''} ${selected?.id === s.id ? styles.selected : ''}`}
                onClick={() => handleView(s)}
              >
                <div className={styles.itemIcon}>
                  <FiInbox />
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemName}>{s.name}</div>
                  <div className={styles.itemEmail}>{s.email}</div>
                  <div className={styles.itemProject}>
                    Project: <strong>{s.projectTitle || s.projectId}</strong>
                  </div>
                </div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemDate}>{formatDate(s.createdAt)}</span>
                  {!s.read && <span className={styles.dot} />}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.detail}>
            {!selected ? (
              <div className={styles.noSelect}>
                <FiInbox size={48} />
                <p>Select a submission to view details</p>
              </div>
            ) : (
              <>
                <div className={styles.detailHeader}>
                  <div>
                    <h2>Interest in: {selected.projectTitle || selected.projectId}</h2>
                    <p>From <strong>{selected.name}</strong></p>
                    <p>Email: {selected.email}</p>
                    {selected.phone && <p>Phone: {selected.phone}</p>}
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
                {selected.message && (
                  <div className={styles.message}>{selected.message}</div>
                )}
                <div className={styles.viewLink}>
                  <a
                    href={`/projects/${selected.projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiEye /> View Project
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
