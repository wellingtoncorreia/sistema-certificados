import { NextResponse } from 'next/server';
import * as pdfParseModule from 'pdf-parse'; // ✅ Alterado aqui
import JSZip from 'jszip';
import { aprovado } from '@/app/lib/regraAprovacao';
import { gerarCertificado } from '@/app/lib/certificadoGenerator';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // Lê o conteúdo do PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const textoPDF = pdfData.text;

    // LÓGICA DE EXTRAÇÃO:
    // Esta função precisa ser adaptada com Regex para ler o layout exato do diário emitido pelo sistema do SENAI.
    const alunos = extrairDadosDoPDF(textoPDF);
    
    const zip = new JSZip();
    let certificadosGerados = 0;

    // Processa cada aluno usando a sua regra de negócio e gerador
    for (const aluno of alunos) {
      if (aprovado(aluno.media, aluno.presenca)) {
        const pdfBytes = await gerarCertificado(aluno.nome);
        zip.file(`Certificado_Honra_Ao_Merito_${aluno.nome.replace(/\s+/g, '_')}.pdf`, pdfBytes);
        certificadosGerados++;
      }
    }

    if (certificadosGerados === 0) {
      return NextResponse.json({ error: 'Nenhum aluno atingiu os critérios de aprovação.' }, { status: 404 });
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="certificados_turma.zip"`,
      },
    });

  } catch (error) {
    console.error("Erro ao gerar certificados:", error);
    return NextResponse.json({ error: 'Erro interno ao processar o arquivo.' }, { status: 500 });
  }
}

// Função auxiliar para extrair texto (Exemplo genérico)
function extrairDadosDoPDF(texto: string) {
  // Aqui você implementará a lógica de "split" ou "regex" para ler o padrão do seu PDF.
  // Exemplo estático para fins de demonstração:
  return [
    { nome: "João Silva", media: 96, presenca: 100 },
    { nome: "Maria Oliveira", media: 80, presenca: 90 }, // Não deve gerar
    { nome: "Carlos Souza", media: 90, presenca: 100 }  // Vai gerar pela presença
  ];
}