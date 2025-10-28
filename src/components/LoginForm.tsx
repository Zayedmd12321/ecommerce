// File: app/components/LoginForm.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Lock } from 'lucide-react';
import styles from '@/app/admin/admin.module.css'; // Use admin styles for generic auth layout

interface LoginFormProps {
  pageTitle: string;
  pageSubtitle: string;
}

export default function LoginForm({ pageTitle, pageSubtitle }: LoginFormProps) {
  const { login, loginError, isLoading } = useAuth();
  const [pinInput, setPinInput] = useState('');

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(pinInput);
  };

  return (
    <div className={styles.loginContainer}>
      <form
        className={`card ${styles.loginCard}`}
        onSubmit={handleLoginSubmit}
      >
        <Lock size={32} className={styles.loginIcon} />
        <h2 className={styles.loginTitle}>{pageTitle}</h2>
        <p className={styles.loginSubtitle}>
          {pageSubtitle}
        </p>
        <div className={styles.formGroup} style={{ width: '100%' }}>
          <label htmlFor="apiKey">ADMIN Key (PIN)</label>
          <input
            type="password"
            id="apiKey"
            className="input-field"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Enter your secret ADMIN Key (key= 1)"
          />
        </div>
        {loginError && <p className={styles.loginError}>{loginError}</p>}
        <button
          type="submit"
          className="button-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  );
}