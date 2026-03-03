'use client';

import React, { useState } from 'react';
import { Upload, FileType, FileArchive, User, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import "./certificados.css";

/* =====================================================
   PAGE
===================================================== */

export default function CertificadosPage() {
  const { loading: authLoading } = useAuth();

  const [layout, setLayout] = useState<File | null>(null);
  const [pdfRemessa, setPdfRemessa] = useState<File | null>(null);

  const [semestre, setSemestre] = useState("1º");
  const [ano, setAno] = useState("2026");
  const [coordenador, setCoordenador] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessar = async () => {

    if (!pdfRemessa || !layout) {
      alert("Envie o layout e o relatório.");
      return;
    }

    if (!coordenador.trim()) {
      alert("Informe o nome do coordenador pedagógico.");
      return;
    }

    setIsProcessing(true);

    try {

      const formData = new FormData();

      formData.append('file', pdfRemessa);
      formData.append('layout', layout);
      formData.append('semestre', semestre);
      formData.append('ano', ano);
      formData.append('coordenador', coordenador);

      const response = await fetch('/api/gerar-certificados', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType?.includes('application/json')) {
          const err = await response.json();
          throw new Error(err.error || "Erro ao processar");
        }

        throw new Error("Erro interno do servidor");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'certificados_senai.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro na comunicação com API");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">

            <header className="mb-10 border-b pb-6">
              <h1 className="text-3xl font-extrabold text-slate-800">
                Emissão de Certificados
              </h1>
              <p className="text-slate-500 mt-2">
                Envie os arquivos e preencha os dados institucionais.
              </p>
            </header>

            {/* ================= UPLOADS ================= */}

            <div className="grid md:grid-cols-2 gap-8 mb-12">

              <UploadCard
                title="Fundo do Certificado"
                file={layout}
                accept="image/*"
                id="layout-input"
                onChange={setLayout}
                icon={<FileType size={28} />}
              />

              <UploadCard
                title="Relatório de Notas (PDF)"
                file={pdfRemessa}
                accept="application/pdf"
                id="pdf-input"
                onChange={setPdfRemessa}
                icon={<Upload size={28} />}
              />

            </div>

            {/* ================= DADOS DINÂMICOS ================= */}

            <div className="grid md:grid-cols-3 gap-8 mb-12">

              {/* Semestre */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar size={18} />
                  Semestre
                </label>
                <select
                  value={semestre}
                  onChange={(e)=>setSemestre(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1º">1º Semestre</option>
                  <option value="2º">2º Semestre</option>
                </select>
              </div>

              {/* Ano */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">
                  Ano Letivo
                </label>
                <input
                  type="number"
                  value={ano}
                  onChange={(e)=>setAno(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Coordenador */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 flex items-center gap-2">
                  <User size={18} />
                  Coordenador Pedagógico
                </label>
                <input
                  type="text"
                  value={coordenador}
                  onChange={(e)=>setCoordenador(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* ================= BOTÃO ================= */}

            <div className="flex justify-center">
              <button
                onClick={handleProcessar}
                disabled={!layout || !pdfRemessa || isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processando...
                  </>
                ) : (
                  <>
                    Gerar Certificados
                    <FileArchive size={20} />
                  </>
                )}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

/* =====================================================
   UploadCard
===================================================== */

type UploadCardProps = {
  title: string;
  file: File | null;
  accept: string;
  id: string;
  onChange: (file: File | null) => void;
  icon: React.ReactNode;
};

function UploadCard({
  title,
  file,
  accept,
  id,
  onChange,
  icon,
}: UploadCardProps) {

  return (
    <div className={`p-8 rounded-2xl border-2 border-dashed transition-all ${
      file
        ? "border-blue-500 bg-blue-50"
        : "border-slate-300 bg-white"
    }`}>
      <div className="flex items-center gap-3 mb-6 text-slate-600">
        {icon}
        <h2 className="font-bold text-lg">{title}</h2>
      </div>

      <input
        type="file"
        accept={accept}
        id={id}
        className="hidden"
        onChange={(e)=>onChange(e.target.files?.[0] ?? null)}
      />

      <label
        htmlFor={id}
        className="cursor-pointer block text-center p-6 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-all"
      >
        {file ? (
          <span className="text-blue-600 font-medium">
            ✅ {file.name}
          </span>
        ) : (
          "Selecionar arquivo"
        )}
      </label>
    </div>
  );
}