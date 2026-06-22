import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Recuperar usuario de localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-dark-300">
          🎯 Apuestas
        </Link>

        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <span className="text-secondary text-sm">{user.email}</span>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-primary hover:text-dark-300 transition">
                  Admin
                </Link>
              )}
              <Link href="/app" className="text-primary hover:text-dark-300 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-primary transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-primary transition">
              Participar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
