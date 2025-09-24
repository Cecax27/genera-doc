import JSZip from "jszip";
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
    const params = csv.split('\n')[0].split(',').map(param => param.trim())
    // Parsear CSV
    const { data: rows } = Papa.parse(csv, { header: true });

    // Crear ZIP
    const zip = new JSZip();
    let count = 1;

    rows.forEach((row, idx) => {
      // Modificar el SVG (ejemplo: reemplazar marcador {{name}})
      let modifiedSvg = svg;
      params.forEach(param => {
         const value = row[param] || row[0] || params;
          const regex = new RegExp(`\\{\\{\\s*${param}\\s*\\}\\}`, "g");
        modifiedSvg = modifiedSvg.replace(regex, value);
      });
      
      zip.file(`${row.filename || "file_" + (idx + 1)}.svg`, modifiedSvg);
      count++;
    })

    // Generar zip final
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=genera-doc.zip");
    res.status(200).send(zipContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
