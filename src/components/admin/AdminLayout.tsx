'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { icon: 'fa-home', label: 'Dashboard', href: '/admin/dashboard' },
    { icon: 'fa-chart-bar', label: 'Analytics', href: '/admin/analytics' },
    { icon: 'fa-user', label: 'About', href: '/admin/about' },
    { icon: 'fa-book', label: 'Publications', href: '/admin/publications' },
    { icon: 'fa-tags', label: 'Categories', href: '/admin/categories' },
    { icon: 'fa-briefcase', label: 'Services', href: '/admin/services' },
    { icon: 'fa-blog', label: 'Blog', href: '/admin/blog' },
    { icon: 'fa-chalkboard-teacher', label: 'Masterclasses', href: '/admin/masterclasses' },
    { icon: 'fa-user-graduate', label: 'Registrations', href: '/admin/registrations' },
    { icon: 'fa-images', label: 'Gallery', href: '/admin/gallery' },
    { icon: 'fa-envelope', label: 'Messages', href: '/admin/contacts' },
    { icon: 'fa-users', label: 'Newsletter', href: '/admin/newsletter' },
    { icon: 'fa-cog', label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-gray-600 hover:text-gray-900 lg:hidden"
            >
              <i className="fas fa-bars text-xl" />
            </button>
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">KC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-gray-600 hover:text-gray-900"
            >
              <i className="fas fa-external-link-alt" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-20',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <i className={`fas ${item.icon} w-5`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          isSidebarOpen ? 'lg:pl-64' : 'pl-0'
        )}
      >
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

