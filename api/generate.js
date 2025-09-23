import { NextResponse } from "next/server";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import Papa from "papaparse";

export const config = {
  runtime: "nodejs18.x", // o "nodejs" si necesitas fs, puppeteer, etc.
};

export default async function handler(req) {
  try {
    const { svg, csv } = await req.json();

    // 1. Parsear el CSV
    const { data: rows } = Papa.parse(csv, { header: true });

    // 2. Crear ZIP
    const zip = new JSZip();

    let count = 1;
    for (const row of rows) {
      // Aquí modificas el SVG según la fila
      let modifiedSvg = svg.replace("{{name}}", row.name);

      // 3. Convertir SVG a PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      page.drawText(`SVG modificado: ${row.name}`); // Ejemplo, aquí podrías rasterizar el SVG

      const pdfBytes = await pdfDoc.save();

      // 4. Agregar al ZIP
      zip.file(`file_${count}.pdf`, pdfBytes);
      count++;
    }

    // 5. Generar zip final
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=output.zip",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
