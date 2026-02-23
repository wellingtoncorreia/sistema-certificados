"use client"

import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("coordenacao@senai.br")
  const [senha, setSenha] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ email, senha })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* Logo */}
       <img src="logo-senai.png" className="w-24 mx-auto mb-6" />

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-slate-800">
          Sistema de Certificados
        </h1>

        <p className="text-center text-slate-600 text-sm mt-2 mb-6">
          Escola SENAI e Faculdade SENAI Gaspar Ricardo Júnior
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800 shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 transition-colors text-white font-semibold py-2 rounded-lg mt-2"
          >
            Entrar
          </button>
        </form>

        {/* Credenciais padrão */}
        <div className="text-center text-xs text-slate-500 mt-6">
          <p className="font-medium">Credenciais padrão:</p>
          <p>
            coordenacao@senai.br / <span className="font-semibold">senai2025</span>
          </p>
        </div>
      </div>
    </div>
  )
}