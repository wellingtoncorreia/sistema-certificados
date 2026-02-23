import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { Plus } from "lucide-react"

export default function TurmasPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen">
        <Header />

        <main className="p-10">

          {/* Título + Botão */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Turmas
              </h2>
              <p className="text-slate-600">
                Gerencie as turmas e adicione alunos
              </p>
            </div>

            <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl transition">
              <Plus size={18} />
              Nova Turma
            </button>
          </div>

          {/* Estado vazio */}
          <div className="bg-white rounded-2xl shadow p-20 text-center">
            <div className="text-slate-400 text-6xl mb-6">+</div>
            <h3 className="text-xl font-semibold text-slate-800">
              Nenhuma turma cadastrada
            </h3>
            <p className="text-slate-600 mt-2">
              Crie sua primeira turma para começar a gerenciar certificados
            </p>
          </div>

        </main>

       

      </div>
    </div>
  )
}