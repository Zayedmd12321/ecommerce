// File: app/ThemeToggle.tsx
"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  // 1. Change default state to 'dark'
  const [theme, setTheme] = useState('dark');

  // On mount, check localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme); // Respect saved theme
    } else if (prefersDark) {
      setTheme('dark');
    }
    // If no saved theme and system prefers light, it will default to 'dark'
    // from the initial state, which is what you wanted.
  }, []);

  // Whenever theme changes, update DOM and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="sun-icon" />
      <Moon className="moon-icon" />
    </button>
  );
}