import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export const runtime = 'nodejs';

/* =====================================================
   EXTRATOR E DATA
===================================================== */
function extrairAlunos(texto: string): string[] {
  const alunos: string[] = [];
  const linhas = texto.split('\n');
  let nomeAtual = '';
  for (const linha of linhas) {
    const limpa = linha.trim();
    const inicioAluno = limpa.match(/^(\d+)\-([A-ZÀ-Ú\s]+)/);
    if (inicioAluno) {
      if (nomeAtual.length > 5) alunos.push(nomeAtual.trim());
      nomeAtual = inicioAluno[2].trim();
      continue;
    }
    if (nomeAtual && /^[A-ZÀ-Ú\s]+$/.test(limpa) && limpa.length > 2 && 
        !['Arquitetura', 'Média', 'Frequência'].some(word => limpa.includes(word))) {
      nomeAtual += ' ' + limpa.trim();
    }
  }
  if (nomeAtual.length > 5) alunos.push(nomeAtual.trim());
  return [...new Set(alunos)];
}

function getDataExtenso() {
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const d = new Date();
  return `Sorocaba, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

/* =====================================================
   API ROUTE
===================================================== */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get('file') as File | null;
    const layoutFile = formData.get('layout') as File | null;

    if (!pdfFile || !layoutFile) return NextResponse.json({ error: 'Arquivos ausentes' }, { status: 400 });

    const pdfParse = (await import('pdf-parse')).default;
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const data = await pdfParse(buffer);
    const alunos = extrairAlunos(data.text);

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch(new URL('/fonts/GreatVibes-Regular.ttf', req.url)).then(res => res.arrayBuffer());
    const fontNome = await pdfDoc.embedFont(fontBytes);
    const fontPadrao = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontNegrito = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const layoutBytes = await layoutFile.arrayBuffer();
    const layout = layoutFile.type === 'image/png' ? await pdfDoc.embedPng(layoutBytes) : await pdfDoc.embedJpg(layoutBytes);
    const { width: largura, height: altura } = layout;

    // 5.3cm do topo = ~150 pontos
    const yTopo = altura - 150;

    for (const nome of alunos) {
      const page = pdfDoc.addPage([largura, altura]);
      page.drawImage(layout, { x: 0, y: 0, width: largura, height: altura });

      // 1. CABEÇALHO (Escola e Faculdade)
      const cabecalhos = ["ESCOLA E FACULDADE DE TECNOLOGIA", "SENAI GASPAR RICARDO JUNIOR"];
      cabecalhos.forEach((txt, i) => {
        const size = 12;
        const w = fontNegrito.widthOfTextAtSize(txt, size);
        page.drawText(txt, { x: (largura - w) / 2, y: yTopo - (i * 15), size, font: fontNegrito });
      });

      // 2. NOME (Posicionado mais alto para diminuir o espaço central)
      const nomeFormatado = nome.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
      const sizeNome = 65;
      const yNome = altura * 0.52; // Ajustado conforme as setas da sua imagem
      const wNome = fontNome.widthOfTextAtSize(nomeFormatado, sizeNome);
      page.drawText(nomeFormatado, { x: (largura - wNome) / 2, y: yNome, size: sizeNome, font: fontNome });

      // 3. TEXTO DE HOMENAGEM
      const frases = [
        "Homenageamos o(a) aluno(a), regularmente matriculado(a) no Curso Técnico em Desenvolvimento de Sistemas,",
        "por ter apresentado EXCELENTE APROVEITAMENTO ESCOLAR + 100% de FREQUÊNCIA ESCOLAR",
        "no segundo semestre do ano letivo 2025."
      ];
      let yHomenagem = yNome - 45;
      frases.forEach(frase => {
        const size = 14;
        const w = fontPadrao.widthOfTextAtSize(frase, size);
        page.drawText(frase, { x: (largura - w) / 2, y: yHomenagem, size, font: fontPadrao });
        yHomenagem -= 20;
      });

      // 4. DATA (Acima do logo SENAI - ajustado para não sobrepor)
      const txtData = getDataExtenso();
      page.drawText(txtData, {
        x: 120, // Levemente para a direita para centralizar sobre o logo
        y: 155, // Aumentado para ficar ACIMA do logo, não sobre ele
        size: 16,
        font: fontPadrao
      });

      // 5. ASSINATURA (Lado direito)
      const xAss = largura - 450;
      const yAss = 80;
      const linhaWidth = 220;

      page.drawLine({
        start: { x: xAss, y: yAss + 18 },
        end: { x: xAss + linhaWidth, y: yAss + 18 },
        thickness: 0.8,
        color: rgb(0, 0, 0)
      });

      const cargo = "Coordenador Pedagógico";
      const wCargo = fontPadrao.widthOfTextAtSize(cargo, 11);
      page.drawText(cargo, { x: xAss + (linhaWidth - wCargo) / 2, y: yAss, size: 11, font: fontPadrao });
    }

    const finalPdf = await pdfDoc.save();
    return new NextResponse(finalPdf, {
      headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=certificados_senai.pdf' }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}