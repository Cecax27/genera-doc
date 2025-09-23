import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import Papa from "papaparse";
import sharp from 'sharp';

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
    const params = [...new Set(
          csv
            .split("{{")
            .slice(1)
            .map((param) => param.split("}}")[0].trim())
        )];
    // Parsear CSV
    const { data: rows } = Papa.parse(csv, { header: true });

    // Crear ZIP
    const zip = new JSZip();
    let count = 1;

    for (const row of rows) {
      // Modificar el SVG (ejemplo: reemplazar marcador {{name}})
      let modifiedSvg = svg;
      params.forEach(param => {
        modifiedSvg = modifiedSvg.replace(`{{${param}}}`, row.param);
      });

      // svgString: tu SVG obtenido de Inkscape
      const svgBuffer = Buffer.from(modifiedSvg);
      const pngBuffer = await sharp(svgBuffer).png().toBuffer(); // Convierte SVG a PNG

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 200]);

      // Añadir imagen PNG al PDF
      const pngImage = await pdfDoc.embedPng(pngBuffer);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight()
      });

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
