// api/analizar.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { producto, costo, precio, unidades } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY; // Vercel la inyectará aquí automáticamente

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres un experto en comercio exterior y fiscal de México. Analiza este escenario de importación para la marca QUESTA:
            Producto: "${producto}"
            Costo unitario: $${costo} MXN
            Precio venta: $${precio} MXN
            Unidades: ${unidades}
            
            Responde brevemente en 3 puntos:
            1. ¿Qué NOM (Norma Oficial Mexicana) podría aplicarse a este producto?
            2. Nivel de riesgo en aduana (bajo/medio/alto) y por qué.
            3. Un consejo táctico de marketing para TikTok/Mercado Libre México.`
          }]
        }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la inteligencia de QUESTA' });
  }
}
