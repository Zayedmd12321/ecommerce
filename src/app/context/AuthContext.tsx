// File: app/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  apiKey: string | null;
  isLoading: boolean;
  loginError: string | null;
  login: (pin: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// The key we'll use in localStorage
const AUTH_KEY = 'ecom_api_key';

export function AuthProvider({ children }: AuthProviderProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [loginError, setLoginError] = useState<string | null>(null);

  // On initial load, check localStorage for a saved key
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(AUTH_KEY);
      if (savedKey) {
        // Here, we just set the key. We'll verify it if/when they
        // try to fetch data. A simple verification could be added here.
        setApiKey(savedKey);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Could not read from localStorage', error);
    }
    setIsLoading(false); // Finished loading auth state
  }, []);

  // The login function
  const login = async (pin: string) => {
    setLoginError(null);
    setIsLoading(true);

    try {
      // Verify the key by trying to fetch products
      const res = await fetch('/api/products', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pin}`,
        },
      });
      if (res.status === 401) {
        throw new Error('Unauthorized. Invalid ADMIN Key.');
      }
      if (!res.ok) {
        throw new Error('Failed to authenticate. API may be down.');
      }

      // If successful:
      setApiKey(pin);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, pin); // Save to localStorage
    } catch (error: any) {
      setLoginError(error.message || 'Login failed.');
    }
    setIsLoading(false);
  };

  // The logout function
  const logout = () => {
    setApiKey(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY); // Remove from localStorage
  };

  const value = {
    isAuthenticated,
    apiKey,
    isLoading, // We provide this for loading spinners
    loginError,
    login,
    logout,
  };

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-primary)',
        }}
      >
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily use the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}