'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  DoorOpen,
  QrCode,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Usuários',
    href: '/dashboard/users',
    icon: Users,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Entidades',
    href: '/dashboard/entities',
    icon: Building2,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Controle de Acesso',
    href: '/dashboard/access',
    icon: DoorOpen,
  },
  {
    title: 'Visitantes (QR Code)',
    href: '/dashboard/visitors',
    icon: QrCode,
    roles: ['SUPERADMIN', 'ADMIN', 'OPERATOR'],
  },
  {
    title: 'Configurações',
    href: '/dashboard/config',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed && (
          <h1 className="font-bold text-lg">Access Control</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              isCollapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-2">
        {!isCollapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
            <p className="text-xs text-primary mt-1">{user.role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950',
            isCollapsed && 'justify-center'
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  );
}
