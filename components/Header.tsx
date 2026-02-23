import { User } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Sistema de Certificados SENAI
        </h1>
        <p className="text-slate-600">
          Escola SENAI e Faculdade SENAI Gaspar Ricardo Júnior
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center">
          <User />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Coordenação SENAI</p>
          <p className="text-sm text-slate-500">coordenacao@senai.br</p>
        </div>
      </div>

    </header>
  )
}