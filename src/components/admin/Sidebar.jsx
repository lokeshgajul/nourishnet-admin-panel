'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'NGO Applications', icon: Building2, href: '/admin/ngos' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
            <span className="text-white font-bold text-xl leading-none">N</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-none">NourishNet</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'group-hover:text-gray-700'}`} />
                  <span className={`text-sm font-semibold ${isActive ? 'text-green-700' : ''}`}>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-50">
        <button className="w-full flex items-center space-x-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-semibold text-sm group">
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
