import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { BookOpen, Users, Award } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen">

        <Header />

        <main className="p-10">

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-600">
              Visão geral do sistema de certificados
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-6 mb-10">

            <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-slate-600">Total de Turmas</p>
                <h3 className="text-3xl font-bold mt-4">0</h3>
              </div>
              <div className="bg-blue-500 p-4 rounded-xl text-white">
                <BookOpen />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-slate-600">Total de Alunos</p>
                <h3 className="text-3xl font-bold mt-4">0</h3>
              </div>
              <div className="bg-green-500 p-4 rounded-xl text-white">
                <Users />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-slate-600">Certificados Gerados</p>
                <h3 className="text-3xl font-bold mt-4">0</h3>
              </div>
              <div className="bg-yellow-500 p-4 rounded-xl text-white">
                <Award />
              </div>
            </div>

          </div>

          {/* Estado vazio */}
          <div className="bg-white rounded-2xl shadow p-16 text-center">
            <BookOpen size={60} className="mx-auto text-slate-400 mb-6" />
            <h3 className="text-xl font-semibold text-slate-800">
              Nenhuma turma cadastrada
            </h3>
            <p className="text-slate-600 mt-2">
              Comece criando uma nova turma na seção "Turmas"
            </p>
          </div>

        </main>

       

      </div>

    </div>
  )
}