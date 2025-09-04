'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function Navbar() {
  const { user, loading, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      alert("Successfully logged out!");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          My E-Commerce
        </Link>
        <div className="flex items-center space-x-4">
          {loading ? (
            <p>Loading...</p>
          ) : user ? (
            // User is logged in
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <div className="flex items-center space-x-2 cursor-pointer">
                  {user.photoUrl && (
                    <img
                      src={user.photoUrl}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full border-2 border-indigo-400"
                    />
                  )}
                  <span className="font-medium hidden md:inline">{user.name}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="py-1 px-3 bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            // User is not logged in
            <Link href="/login">
              <button className="py-1 px-3 bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}