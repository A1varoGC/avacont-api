import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ CONFIGURACIÓN SEGURA DE CORS
const allowedOrigins = [
  "https://avacont-prueba.avantia.dev", // tu dominio real
  "https://avantia.dev",                // dominio raíz
  "http://127.0.0.1:5500",              // Live Server (opcional)
  "http://localhost:5500"               // Live Server (opcional)
  "http://localhost:8000" 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("🚫 Bloqueado por CORS:", origin);
      callback(new Error("Origen no permitido por CORS"));
    }
  },
  credentials: true,
}));

// 🔑 Token de Decolecta (usa tu variable de entorno TOKEN_API)
const TOKEN = process.env.TOKEN_API || "sk_10862.Ms3HRKnVyvESQWwIbgPjokM6REQGQesP";

// 🚀 Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor AVACONT activo ✅");
});

// 🧾 Ruta de consulta de RUC
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
        departamento: data.departamento
      });
    } else {
      res.status(404).json({ error: "RUC no encontrado", detalle: data });
    }
  } catch (err) {
    console.error("❌ Error al consultar SUNAT:", err);
    res.status(500).json({ error: "Error al consultar la API de SUNAT" });
  }
});

// ⚙️ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));


