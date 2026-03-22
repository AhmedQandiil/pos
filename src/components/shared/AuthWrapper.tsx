'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
