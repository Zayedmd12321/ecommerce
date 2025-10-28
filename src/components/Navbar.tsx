// File: app/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation'; // Import usePathname
import './styles/navbar.css'; // Import the new CSS file

export default function Navbar() {
  const pathname = usePathname(); // Get the current path

  return (
    <header className="main-header">
      <nav className="main-nav">
        <Link href="/" className="nav-logo">
          <ShoppingBag size={24} />
          {/* Added a span for special styling */}
          <span className="nav-logo-text">E-Store</span>
        </Link>

        <div className="nav-links">
          {/* Add className to dynamically set 'active' class */}
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link
            href="/dashboard"
            className={pathname.startsWith('/dashboard') ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className={pathname.startsWith('/admin') ? 'active' : ''}
          >
            Admin
          </Link>
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
}