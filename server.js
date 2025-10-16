import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ CORS correctamente configurado
app.use(
  cors({
    origin: [
      "https://avacont-prueba.avantia.dev", // dominio de tu sitio
      "https://avantia.dev",                // dominio principal
      "http://localhost:3000"               // entorno local (opcional)
    ],
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

// 🔑 Token desde Render (variable de entorno)
const TOKEN = process.env.TOKEN_API;

// 🚀 Ruta de verificación
app.get("/", (req, res) => {
  res.send("Servidor AVACONT activo ✅");
});

// 🧾 Ruta para consulta de RUC
app.get("/ruc", async (req, res) => {
  const numero = req.query.numero;
  if (!numero) return res.status(400).json({ error: "Falta número de RUC" });

  try {
    const url = `https://api.decolecta.com/v1/sunat/ruc?numero=${numero}&token=${TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.razon_social) {
      res.json({
        ruc: data.numero_documento,
        razonSocial: data.razon_social,
        direccion: data.direccion,
        estado: data.estado,
        condicion: data.condicion,
        distrito: data.distrito,
        provincia: data.provincia,
        departamento: data.departamento,
      });
    } else {
      res.status(404).json({ error: "RUC no encontrado", detalle: data });
    }
  } catch (err) {
    console.error("❌ Error al consultar SUNAT:", err);
    res.status(500).json({ error: "Error al consultar la API de SUNAT" });
  }
});

// ⚙️ Render asigna su propio puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor AVACONT API corriendo en puerto ${PORT}`);
});


