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
    })

    // Generar zip final
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=output.zip");
    res.status(200).send(zipContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
