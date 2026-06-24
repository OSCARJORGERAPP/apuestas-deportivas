import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isPublic = ['/login', '/auth/verify', '/'].includes(router.pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={user?.role === 'admin' ? '/admin' : '/app'} className="text-2xl font-bold text-blue-600">
            ⚽ Apuestas
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <span className="text-gray-600">{user.email}</span>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Salir
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 p-4 space-y-3">
            {user && (
              <>
                <div className="text-gray-600 text-sm">{user.email}</div>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block text-blue-600 font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
