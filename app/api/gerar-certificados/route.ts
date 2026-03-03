import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export const runtime = 'nodejs';

/* =====================================================
   LIMPAR TEXTO (FIX WinAnsi)
===================================================== */
function limparTexto(texto: string) {
  return texto
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* =====================================================
   EXTRAIR ALUNOS (NOME EM 2 LINHAS)
===================================================== */
function extrairAlunos(texto: string): string[] {

  const alunos: string[] = [];
  const linhas = texto.split('\n');

  let nomeAtual = '';

  for (const linha of linhas) {

    const limpa = linha.trim();

    const inicio = limpa.match(/^(\d+)\-([A-ZÀ-Ú\s]+)/);

    if (inicio) {
      if (nomeAtual.length > 5)
        alunos.push(limparTexto(nomeAtual));

      nomeAtual = inicio[2];
      continue;
    }

    if (
      nomeAtual &&
      /^[A-ZÀ-Ú\s]+$/.test(limpa) &&
      limpa.length > 2 &&
      !['Arquitetura','Média','Frequência'].some(w =>
        limpa.includes(w)
      )
    ) {
      nomeAtual += ' ' + limpa;
    }
  }

  if (nomeAtual.length > 5)
    alunos.push(limparTexto(nomeAtual));

  return [...new Set(alunos)];
}

/* =====================================================
   EXTRAIR CURSO (REMOVE DATA DE INÍCIO)
===================================================== */
function extrairCurso(texto: string): string {

  const match = texto.match(
    /(Curso\s+(Técnico|de|em)\s+[A-Za-zÀ-ú\s]+)/i
  );

  if (!match) return 'Desenvolvimento de Sistemas';

  let curso = match[0];

  curso = curso
    .split(/Data\s+de\s+Início/i)[0]
    .split(/Carga\s+Horária/i)[0]
    .split(/Turno/i)[0]
    .split(/Turma/i)[0];

  return limparTexto(curso);
}

/* =====================================================
   DATA EXTENSO
===================================================== */
function getDataExtenso() {
  const meses = [
    'janeiro','fevereiro','março','abril','maio','junho',
    'julho','agosto','setembro','outubro','novembro','dezembro'
  ];

  const d = new Date();

  return `Sorocaba, ${d.getDate()} de ${
    meses[d.getMonth()]
  } de ${d.getFullYear()}`;
}

/* =====================================================
   API
===================================================== */
export async function POST(req: NextRequest) {

  try {

    const formData = await req.formData();

    const pdfFile = formData.get('file') as File;
    const layoutFile = formData.get('layout') as File;

    const semestre = limparTexto(
      (formData.get('semestre') as string) || 'primeiro'
    );

    const ano = limparTexto(
      (formData.get('ano') as string) || '2026'
    );

    const coordenador = limparTexto(
      (formData.get('coordenador') as string) || ''
    );

    if (!pdfFile || !layoutFile)
      return NextResponse.json(
        { error: 'Arquivos ausentes' },
        { status: 400 }
      );

    /* ========= LER PDF ========= */

    const pdfParse = (await import('pdf-parse')).default;

    const buffer = Buffer.from(
      await pdfFile.arrayBuffer()
    );

    const data = await pdfParse(buffer);

    const alunos = extrairAlunos(data.text);
    const curso = extrairCurso(data.text);

    if (!alunos.length)
      return NextResponse.json(
        { error: 'Nenhum aluno encontrado' },
        { status: 404 }
      );

    /* ========= CRIAR PDF ========= */

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    /* fonte manuscrita */
    const fontBytes = await fetch(
      new URL('/fonts/GreatVibes-Regular.ttf', req.url)
    ).then(r => r.arrayBuffer());

    const fontNome = await pdfDoc.embedFont(fontBytes);

    const fontPadrao =
      await pdfDoc.embedFont(StandardFonts.Helvetica);

    const fontNegrito =
      await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    /* layout */
    const layoutBytes = await layoutFile.arrayBuffer();

    const layout =
      layoutFile.type === 'image/png'
        ? await pdfDoc.embedPng(layoutBytes)
        : await pdfDoc.embedJpg(layoutBytes);

    const { width: largura, height: altura } = layout;

    const yTopo = altura - 150;

    /* =====================================================
       LOOP CERTIFICADOS
    ===================================================== */

    for (const nomeRaw of alunos) {

      const nome = limparTexto(
        nomeRaw.toLowerCase()
          .replace(/\b\w/g, l => l.toUpperCase())
      );

      const page = pdfDoc.addPage([largura, altura]);

      page.drawImage(layout, {
        x: 0,
        y: 0,
        width: largura,
        height: altura,
      });

      /* ===== CABEÇALHO ===== */

      const cabecalhos = [
        "ESCOLA E FACULDADE DE TECNOLOGIA",
        "SENAI GASPAR RICARDO JUNIOR"
      ];

      cabecalhos.forEach((txt, i) => {
        const size = 12;
        const w =
          fontNegrito.widthOfTextAtSize(txt, size);

        page.drawText(txt, {
          x: (largura - w) / 2,
          y: yTopo - (i * 15),
          size,
          font: fontNegrito,
        });
      });

      /* ===== NOME ===== */

      const sizeNome = 65;
      const yNome = altura * 0.52;

      const wNome =
        fontNome.widthOfTextAtSize(nome, sizeNome);

      page.drawText(nome, {
        x: (largura - wNome) / 2,
        y: yNome,
        size: sizeNome,
        font: fontNome,
      });

      /* ===== TEXTO DINÂMICO ===== */

      const frases = [
        `Homenageamos o(a) aluno(a), regularmente matriculado(a) no ${curso},`,
        `por ter apresentado EXCELENTE APROVEITAMENTO ESCOLAR + 100% de FREQUÊNCIA ESCOLAR`,
        `no ${semestre} semestre do ano letivo ${ano}.`
      ];

      let yTexto = yNome - 45;

      frases.forEach(frase => {

        const limpa = limparTexto(frase);

        const size = 14;

        const w =
          fontPadrao.widthOfTextAtSize(limpa, size);

        page.drawText(limpa, {
          x: (largura - w) / 2,
          y: yTexto,
          size,
          font: fontPadrao,
        });

        yTexto -= 20;
      });

      /* ===== DATA ===== */

      page.drawText(getDataExtenso(), {
        x: 120,
        y: 155,
        size: 16,
        font: fontPadrao,
      });

      /* ===== ASSINATURA ===== */

      const xAss = largura - 450;
      const yAss = 80;
      const linhaWidth = 220;

      page.drawLine({
        start: { x: xAss, y: yAss + 28 },
        end: { x: xAss + linhaWidth, y: yAss + 28 },
        thickness: 0.8,
        color: rgb(0, 0, 0),
      });

      const wCoord =
        fontPadrao.widthOfTextAtSize(coordenador, 11);

      page.drawText(coordenador, {
        x: xAss + (linhaWidth - wCoord) / 2,
        y: yAss + 10,
        size: 11,
        font: fontPadrao,
      });

      const cargo = "Coordenador Pedagógico";

      const wCargo =
        fontPadrao.widthOfTextAtSize(cargo, 10);

      page.drawText(cargo, {
        x: xAss + (linhaWidth - wCargo) / 2,
        y: yAss - 5,
        size: 10,
        font: fontPadrao,
      });
    }

    /* ========= FINAL ========= */

    const finalPdf = await pdfDoc.save();

    return new NextResponse(finalPdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=certificados_senai.pdf',
      },
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}