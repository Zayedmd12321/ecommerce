// File: app/components/Footer.tsx
import Link from 'next/link';
import { ShoppingBag, Github, Twitter, Linkedin } from 'lucide-react';
import './styles/footer.css'; // Import the new CSS file

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* Column 1: Brand */}
        <div className="footer-column brand-column">
          <Link href="/" className="footer-logo">
            <ShoppingBag size={28} />
            <span className="footer-logo-text">E-Store</span>
          </Link>
          <p className="footer-tagline">
            Premium products, curated for you.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} E-Store. All rights reserved.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <Link href="/">Home</Link>
          <Link href="/products/classic-t-shirt">Products</Link>
          <Link href="/dashboard">Your Dashboard</Link>
          <Link href="/admin">Admin Panel</Link>
        </div>

        {/* Column 3: Legal */}
        <div className="footer-column">
          <h4>Legal</h4>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Refund Policy</Link>
        </div>

        {/* Column 4: Social */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}