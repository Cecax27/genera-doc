import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import svg2pdf from "svg2pdf.js";


export const config = {
  runtime: "nodejs",
};

const convertSvgToPDF = async (svgText) => {
  if (!svgText) return;
  
  const doc = new jsPDF({
    unit: "pt",
    format: "a4"
  });

  await svg2pdf(svgText, doc, { x: 0, y: 0, width: 500, height: 500 });

  // Save PDF and trigger download
  const pdfBytes = doc.output("arraybuffer");

  return pdfBytes;

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
      
      const pdfBytes = await convertSvgToPDF(modifiedSvg)

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
