'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileBadge, 
  Users, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../services/supabase';
import "./Sidebar.css";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Emitir Certificados', href: '/certificados', icon: FileBadge },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Redirecionamento físico para limpar o estado do Next.js e cookies do Middleware
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao sair:', error);
      alert('Erro ao encerrar sessão.');
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col sidebar-container">
      {/* Logo / Header da Sidebar */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <GraduationCap className="text-white" size={24} />
        </div>
        <span className="font-bold text-xl text-gray-800 tracking-tight">
          SENAI <span className="text-blue-600">Cert</span>
        </span>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon 
                size={20} 
                className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé / Botão de Sair */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-red-500" />
          <span className="font-medium">Sair do Sistema</span>
        </button>
        
        <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-400 text-center uppercase tracking-widest font-semibold">
            v1.0.0 Stable
          </p>
        </div>
      </div>
    </aside>
  );
}