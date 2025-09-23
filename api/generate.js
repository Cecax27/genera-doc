import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import Papa from "papaparse";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  try {
    // Leer body
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => resolve(JSON.parse(data)));
      req.on("error", reject);
    });

    const { svg, csv } = body;

    // Parsear CSV
    const { data: rows } = Papa.parse(csv, { header: true });

    // Crear ZIP
    const zip = new JSZip();
    let count = 1;

    for (const row of rows) {
      // Modificar el SVG (ejemplo: reemplazar marcador {{name}})
      let modifiedSvg = svg.replace("{{name}}", row.name);

      // Crear un PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 200]);
      page.drawText(`Row ${count}: ${row.name}`);
      const pdfBytes = await pdfDoc.save();

      // Agregar al zip
      zip.file(`file_${count}.pdf`, pdfBytes);
      count++;
    }

    // Generar zip final
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=output.zip");
    res.status(200).send(zipContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
