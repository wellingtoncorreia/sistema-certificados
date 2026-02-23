import { PDFDocument, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"

export async function gerarCertificado(nome: string) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595])

  const logoPath = path.join(process.cwd(), "public/logo/senai.png")
  const logoBytes = fs.readFileSync(logoPath)
  const logoImage = await pdfDoc.embedPng(logoBytes)

  page.drawImage(logoImage, {
    x: 50,
    y: 500,
    width: 120,
    height: 60
  })

  page.drawText("HONRA AO MÉRITO", {
    x: 250,
    y: 520,
    size: 28
  })

  page.drawText(nome, {
    x: 250,
    y: 400,
    size: 32
  })

  return await pdfDoc.save()
}