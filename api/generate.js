import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import svg2pdf from "svg2pdf.js";
import ConvertApi from 'convertapi-js'

let convertApi = ConvertApi.auth(process.env.CONVERTAPI_TOKEN)

export const config = {
  runtime: "nodejs",
};

const convertSvgToPDF = async (svgText) => {
  if (!svgText) return;
  
  let params = convertApi.createParams()
  params.add('File', svgText);
  let result = await convertApi.convert('svg', 'pdf', params)

  const pdfBytes = result;

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

    rows.forEach((row, idx) => {
      // Modificar el SVG (ejemplo: reemplazar marcador {{name}})
      let modifiedSvg = svg;
      params.forEach(param => {
        modifiedSvg = modifiedSvg.replace(`{{${param}}}`, row.param);
      });
      
      zip.file(`file_${idx + 1}.svg`, modifiedSvg);
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
