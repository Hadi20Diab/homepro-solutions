'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdHandyman } from 'react-icons/md';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import styles from './login.module.scss';

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter your credentials.');
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch {
      toast.error('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <MdHandyman />
          <span><strong>HomePro</strong> Solutions</span>
        </div>
        <h1 className={styles.title}>Dashboard Login</h1>
        <p className={styles.sub}>Sign in to access the admin panel</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label>Email Address</label>
            <div className={styles.inputWrap}>
              <FiMail className={styles.inputIcon} />
              <input
                type="email"
                placeholder="admin@homepro.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className={styles.inputWrap}>
              <FiLock className={styles.inputIcon} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(s => !s)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn--primary btn--lg ${styles.submitBtn}`}
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
