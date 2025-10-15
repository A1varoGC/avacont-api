// ===========================
// 🌐 AVACONT API - PRODUCCIÓN
// ===========================
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ Habilitar CORS solo para tus dominios autorizados
app.use(
  cors({
    origin: [
      "https://avacont-prueba.avantia.dev", // Tu dominio público
      "http://localhost:3000"               // Permite pruebas locales
    ],
    methods: ["GET"],
    allowedHeaders: ["Content-Type"]
  })
);

// 🔑 Token de autenticación de Decolecta
const TOKEN = "sk_10862.Ms3HRKnVyvESQWwIbgPjokM6REQGQesP";

// 🚀 Ruta principal (verificación)
app.get("/", (req, res) => {
  res.send("Servidor AVACONT activo ✅");
});

// 🧾 Ruta para consultar datos de RUC
app.get("/ruc", async (req, res) => {
  const numero = req.query.numero;
  if (!numero) {
    return res.status(400).json({ error: "Falta número de RUC" });
  }

  try {
    const url = `https://api.decolecta.com/v1/sunat/ruc?numero=${numero}&token=${TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    // Si la API devuelve "razon_social", usamos esa estructura
    if (data && data.razon_social) {
      res.json({
        ruc: data.numero_documento,
        razonSocial: data.razon_social,
        direccion: data.direccion,
        estado: data.estado,
        condicion: data.condicion,
        distrito: data.distrito,
        provincia: data.provincia,
        departamento: data.departamento
      });
    } else {
      // Si la API devuelve otro formato o error
      res.status(404).json({ error: "RUC no encontrado", detalle: data });
    }
  } catch (err) {
    console.error("❌ Error al consultar SUNAT:", err);
    res.status(500).json({ error: "Error al consultar la API de SUNAT" });
  }
});

// ⚙️ Render asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor AVACONT API corriendo en puerto ${PORT}`);
});

