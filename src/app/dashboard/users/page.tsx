'use client';

import { useEffect, useState } from 'react';
import { FiTrash2, FiUser, FiShield, FiPlus, FiX, FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';
import { getUsers, updateUserRole, deleteUser } from '@/lib/firestore/users';
import { AppUser, UserRole } from '@/types';
import styles from './page.module.scss';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor_blog', label: 'Blog Editor' },
  { value: 'editor_services', label: 'Services Editor' },
  { value: 'editor_projects', label: 'Projects Editor' },
  { value: 'editor_news', label: 'News Editor' },
  { value: 'viewer', label: 'Viewer' },
];

const ROLE_COLORS: Record<UserRole, string> = {
  admin: styles.roleAdmin,
  editor_blog: styles.roleBlog,
  editor_services: styles.roleServices,
  editor_projects: styles.roleProjects,
  editor_news: styles.roleNews,
  viewer: styles.roleViewer,
};

export default function UsersDashboardPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'editor_blog' as UserRole });

  const load = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (uid: string, role: UserRole) => {
    try {
      await updateUserRole(uid, role);
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('Remove this user from the system? They will no longer be able to access the dashboard.')) return;
    await deleteUser(uid);
    toast.success('User removed');
    load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const idToken = await getAuth().currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create user');
      toast.success(`User ${newUser.email} created!`);
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'editor_blog' });
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setCreating(false);
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
          <h1>User Management</h1>
          <p>{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => setShowModal(true)} className={styles.addBtn}>
            <FiPlus /> Add User
          </button>
          <div className={styles.info}>
            <FiShield /> Admin access only
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}><span className="spinner" /></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
          {users.length === 0 && (
            <div className={styles.empty}>No users found. Users appear here after their first login.</div>
          )}
          {users.map(u => (
            <div key={u.uid} className={styles.tableRow}>
              <div className={styles.userCell}>
                <div className={styles.avatar}>
                  {u.displayName?.[0] ?? u.email?.[0] ?? <FiUser />}
                </div>
                <span className={styles.name}>{u.displayName || 'Unnamed'}</span>
              </div>
              <span className={styles.email}>{u.email}</span>
              <span>
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u.uid, e.target.value as UserRole)}
                  className={`${styles.roleSelect} ${ROLE_COLORS[u.role] ?? ''}`}
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </span>
              <span>{formatDate(u.createdAt)}</span>
              <div className={styles.actions}>
                <button onClick={() => handleDelete(u.uid)} title="Remove user" className={styles.danger}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.legend}>
        <h4>Role Permissions</h4>
        <div className={styles.legendGrid}>
          {ROLES.map(r => (
            <div key={r.value} className={styles.legendItem}>
              <span className={`${styles.roleChip} ${ROLE_COLORS[r.value] ?? ''}`}>{r.label}</span>
              <span>
                {r.value === 'admin' && 'Full access to everything'}
                {r.value === 'editor_blog' && 'Create & edit blog posts'}
                {r.value === 'editor_services' && 'Manage services'}
                {r.value === 'editor_projects' && 'Manage projects'}
                {r.value === 'editor_news' && 'Create & edit news'}
                {r.value === 'viewer' && 'Read-only access to contacts'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add New User</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}><FiX /></button>
            </div>
            <form onSubmit={handleCreate} className={styles.modalForm}>
              <div className="form-group">
                <label>Full Name</label>
                <div className={styles.inputWrap}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text" placeholder="Jane Smith" required
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className={styles.inputWrap}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email" placeholder="jane@example.com" required
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className={styles.inputWrap}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type="password" placeholder="Min 6 characters" required minLength={6}
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className={styles.roleSelect}
                >
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={creating} className={styles.saveBtn}>
                  {creating ? 'Creating…' : <><FiPlus /> Create User</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
