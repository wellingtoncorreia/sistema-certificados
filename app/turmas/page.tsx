'use client'

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { Upload, Download, Loader2 } from "lucide-react"

export default function TurmasPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setMessage("Analisando notas e gerando certificados...")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/gerar-certificados", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        setMessage(errorData.error || "Erro ao gerar certificados.")
        setLoading(false)
        return
      }

      // Inicia o download do arquivo ZIP
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "certificados_turma.zip"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      setMessage("Certificados gerados com sucesso!")
    } catch (error) {
      setMessage("Erro na comunicação com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen">
        <Header />

        <main className="p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Turmas</h2>
            <p className="text-slate-600">Importe o diário da turma para emissão em lote.</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-10 max-w-2xl">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <Upload className="w-12 h-12 text-blue-500" />
                  <span className="text-slate-700 font-medium">
                    {file ? file.name : "Clique para selecionar o PDF com as notas"}
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:bg-blue-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Gerar e Baixar Certificados
                  </>
                )}
              </button>

              {message && (
                <p className={`text-center font-medium ${message.includes("Erro") ? "text-red-500" : "text-green-600"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}