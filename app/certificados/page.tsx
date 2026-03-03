'use client';

import React, { useState } from 'react';
import { Upload, FileType, FileArchive } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessar = async () => {
    if (!pdfRemessa || !layout) {
      alert("Envie os dois arquivos.");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();

      // ⚠️ nomes DEVEM ser iguais aos da API
      formData.append('file', pdfRemessa);
      formData.append('layout', layout);

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

        const text = await response.text();
        console.error(text);
        throw new Error("Erro interno do servidor");
      }

      // ✅ download automático do PDF
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

  /* ================= LOADING AUTH ================= */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  /* ================= UI ================= */

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
                Envie o layout e o relatório de notas.
              </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">

              <UploadCard
                title="Fundo do Certificado"
                file={layout}
                accept="image/*"
                id="layout-input"
                onChange={setLayout}
                icon={<FileType size={28} />}
              />

              <UploadCard
                title="Relatório de Notas"
                file={pdfRemessa}
                accept="application/pdf"
                id="pdf-input"
                onChange={setPdfRemessa}
                icon={<Upload size={28} />}
              />

            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleProcessar}
                disabled={!layout || !pdfRemessa || isProcessing}
                className="btn-generate bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50"
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
   COMPONENTE UploadCard (FALTAVA)
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
    <div
      className={`p-8 rounded-2xl border-2 border-dashed transition-all ${
        file
          ? "border-blue-500 bg-blue-50"
          : "border-slate-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-3 mb-6 text-slate-600">
        {icon}
        <h2 className="font-bold text-lg">{title}</h2>
      </div>

      <input
        type="file"
        accept={accept}
        id={id}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
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