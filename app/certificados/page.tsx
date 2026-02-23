import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function CertificadosPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen">
        <Header />

        <main className="p-10">

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Certificados
            </h2>
            <p className="text-slate-600">
              Visualize todos os certificados emitidos
            </p>
          </div>

          {/* Informação */}
          <div className="bg-white rounded-2xl shadow p-20 text-center">
            <p className="text-slate-600 text-lg">
              Os certificados são gerados na seção "Turmas"
            </p>
          </div>

        </main>

      </div>
    </div>
  )
}