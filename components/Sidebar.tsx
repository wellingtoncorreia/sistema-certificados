"use client"

import { LayoutDashboard, BookOpen, Award, Upload, LogOut } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen flex flex-col justify-between">

      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
            SENAI
          </div>
          <div>
            <p className="font-semibold">Sistema de</p>
            <p className="text-sm text-slate-400">Certificados</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-6 space-y-2 px-4">

          <button className="flex items-center gap-3 bg-blue-900 px-4 py-3 rounded-xl w-full">
            <LayoutDashboard size={20} />
            <a href="/dashboard">Dashboard</a>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 w-full">
            <BookOpen size={20} />
            <a href="/turmas">Turmas</a>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 w-full">
            <Award size={20} />
            <a href="/certificados">Certificados</a>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 w-full">
            <Upload size={20} />
            <a href="">Upload Layout</a>
          </button>

        </nav>
      </div>

      {/* Sair */}
      <div className="px-4 py-6 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-300 hover:text-white">
          <LogOut size={20} />
          Sair
        </button>
      </div>

    </aside>
  )
}