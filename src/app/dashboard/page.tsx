// File: app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import DashboardContent from '@/components/DashboardContent';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Dashboard | E-Store';
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <LoginForm
        pageTitle="Dashboard"
        pageSubtitle="Please enter your ADMIN Key to proceed."
      />
    );
  }

  return <DashboardContent />;
}