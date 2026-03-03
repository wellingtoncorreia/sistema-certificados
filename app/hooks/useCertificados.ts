import { useState } from 'react';

export function useCertificados() {
  const [isGenerating, setIsGenerating] = useState(false);

  const gerarRemessa = async (pdf: File, layout: File) => {
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('pdf', pdf);
      formData.append('layout', layout);

      const response = await fetch('/api/gerar-certificados', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha na geração');

      // Download do ZIP
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificados.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Erro ao processar arquivos.");
    } finally {
      setIsGenerating(false);
    }
  };

  return { gerarRemessa, isGenerating };
}