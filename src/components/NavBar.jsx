import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
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
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
          🎯 Apuestas
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-gray-400 text-sm hidden md:inline">{user.email}</span>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-gray-300 hover:text-white transition">
                  Admin
                </Link>
              )}
              <Link href="/app" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition"
            >
              Participar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
