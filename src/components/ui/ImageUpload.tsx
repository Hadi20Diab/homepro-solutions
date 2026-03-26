'use client';

import { useRef, useState } from 'react';
import { FiUpload, FiX, FiLink, FiLoader } from 'react-icons/fi';
import { uploadImage } from '@/lib/storage';
import styles from './ImageUpload.module.scss';

interface Props {
  /** Current image URL (displayed as preview) */
  value: string;
  /** Called with the new public URL after upload or manual URL entry */
  onChange: (url: string) => void;
  /** Supabase Storage sub-folder, e.g. "projects", "blog" */
  folder?: string;
  /** Optional label shown above the upload area */
  label?: string;
}

/**
 * Single-image upload control.
 * — Click / drag-drop to upload → uploads to Supabase, calls onChange with URL
 * — Or paste a URL directly using the URL input fallback
 */
export default function ImageUpload({ value, onChange, folder = 'general', label }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrl,   setShowUrl]   = useState(false);
  const [urlInput,  setUrlInput]  = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrl(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}

      {/* Preview + drop zone */}
      <div
        className={`${styles.dropZone} ${uploading ? styles.loading : ''} ${value ? styles.hasImage : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className={styles.spinner}><FiLoader className={styles.spin} /> Uploading…</div>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className={styles.preview} />
            <div className={styles.overlay}>
              <FiUpload /> Replace
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>
            <FiUpload />
            <span>Click or drag &amp; drop to upload</span>
            <small>PNG, JPG, WebP — max 5 MB</small>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleInputChange}
      />

      {/* Action row: clear + URL fallback */}
      <div className={styles.actions}>
        {value && !uploading && (
          <button type="button" className={styles.clearBtn} onClick={() => onChange('')}>
            <FiX /> Remove image
          </button>
        )}
        <button
          type="button"
          className={styles.urlBtn}
          onClick={() => setShowUrl(v => !v)}
        >
          <FiLink /> {showUrl ? 'Hide' : 'Use URL instead'}
        </button>
      </div>

      {showUrl && (
        <div className={styles.urlRow}>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
            className={styles.urlInput}
          />
          <button type="button" className={styles.applyBtn} onClick={applyUrl}>Apply</button>
        </div>
      )}
    </div>
  );
}
