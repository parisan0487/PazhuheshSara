import { cookies } from 'next/headers';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }) {
  const token = cookies().get('token'); // اینجا HttpOnly هم خونده میشه
  const isAuthenticated = !!token;
  const isAuthPage = false; // اگه خواستی مسیر لاگین رو جدا هندل کن

  return (
    <div className="flex flex-col sm:flex-row min-h-screen text-black mt-10">
      {isAuthenticated && !isAuthPage && <Sidebar />}
      <div className="flex-1 p-4 sm:p-8">
        <main>{children}</main>
      </div>
    </div>
  );
}
