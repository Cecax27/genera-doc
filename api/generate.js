import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import Papa from "papaparse";

export const config = {
  runtime: "nodejs",
};

const convertSvgToPDF = async (svgText) => {
  if (!svgText) return;
  
  // Create a new canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const img = new Image();

  // Set up canvas size based on SVG dimensions
  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);

    // Get the canvas as a PNG
    const pngUrl = canvas.toDataURL('image/png');
    
    // Create PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([img.width, img.height]);

    // Embed PNG image into PDF
    const pngImage = await pdfDoc.embedPng(pngUrl);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    });

    // Save PDF and trigger download
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  };

  // Set the SVG file data as the image source
  img.src = `data:image/svg+xml;base64,${btoa(svgText)}`;
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
      
      const pdfBytes = awaitconvertSvgToPDF(modifiedSvg)

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
