'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col sm:flex-row min-h-screen text-black mt-10">
      {isAuthenticated && <Sidebar />}
      <div className="flex-1 p-4 sm:p-8">
        <main>{children}</main>
      </div>
    </div>
  );
}
