const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');

// Formatos que Gemini acepta directamente por File API
const GEMINI_SUPPORTED_MIMES = {
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

// Prompt para generar flashcards
const FLASHCARD_PROMPT = `Eres un asistente de estudio experto. Analiza el contenido proporcionado y crea una lista de flashcards (tarjetas de estudio).
Extrae la información más importante. Genera entre 8 y 12 flashcards de alta calidad.
Para cada concepto genera un título corto descriptivo, una pregunta, su nivel de dificultad del 1 al 5 y exactamente 4 posibles respuestas donde sólo una sea la correcta.
La salida DEBE SER ÚNICAMENTE un arreglo JSON válido siguiendo exactamente esta estructura:
[
  {
    "titulo": "Arquitectura Cliente-Servidor",
    "pregunta": "¿Qué es la Arquitectura Cliente-Servidor?",
    "dificultad": 2, 
    "respuestas": [
      {"texto": "Un modelo de diseño de red...", "es_correcta": true},
      {"texto": "Un lenguaje de programación...", "es_correcta": false},
      {"texto": "Un tipo de base de datos...", "es_correcta": false},
      {"texto": "Un framework de desarrollo...", "es_correcta": false}
    ]
  }
]`;

/**
 * Extrae texto de archivos .docx y .pptx que Gemini no soporta directamente.
 * @returns {string|null} El texto extraído, o null si el formato es nativo de Gemini.
 */
async function extraerTextoSiEsNecesario(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.docx' || ext === '.doc') {
    console.log("Extrayendo texto del DOCX con mammoth...");
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (ext === '.pptx' || ext === '.ppt') {
    // Intentamos leer las slides como texto plano (pptx es un ZIP con XMLs)
    console.log("Extrayendo texto del PPT/PPTX...");
    try {
      const AdmZip = require('adm-zip');
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      let text = '';
      for (const entry of entries) {
        if (entry.entryName.startsWith('ppt/slides/slide') && entry.entryName.endsWith('.xml')) {
          const xml = entry.getData().toString('utf8');
          // Extraer texto de los tags <a:t>
          const matches = xml.match(/<a:t>([^<]*)<\/a:t>/g);
          if (matches) {
            text += matches.map(m => m.replace(/<\/?a:t>/g, '')).join(' ') + '\n\n';
          }
        }
      }
      return text || 'No se pudo extraer texto del archivo.';
    } catch (e) {
      console.error("Error extrayendo PPT:", e.message);
      return 'No se pudo extraer texto del archivo.';
    }
  }

  return null; // Gemini puede procesar el archivo directamente
}

exports.generarFlashcardsDesdeArchivo = async (filePath, mimeType, displayName) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  // Decidir estrategia: subir archivo o enviar texto extraído
  const extractedText = await extraerTextoSiEsNecesario(filePath);
  let contentParts;

  if (extractedText) {
    // Estrategia TEXTO: enviar el contenido extraído directamente como texto
    console.log(`Texto extraído correctamente (${extractedText.length} caracteres). Enviando a Gemini como texto...`);
    contentParts = [
      `Contenido del documento "${displayName}":\n\n${extractedText}`,
      FLASHCARD_PROMPT
    ];
  } else {
    // Estrategia ARCHIVO: subir a Gemini File API (PDF, imágenes, texto)
    const ext = path.extname(filePath).toLowerCase();
    const resolvedMime = GEMINI_SUPPORTED_MIMES[ext] || 'application/octet-stream';
    console.log(`Subiendo archivo a Gemini: ${filePath} (${resolvedMime})`);

    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: resolvedMime,
      displayName
    });
    console.log(`Archivo subido. URI: ${uploadResponse.file.uri}`);

    contentParts = [
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri
        }
      },
      FLASHCARD_PROMPT
    ];
  }

  // Generar flashcards
  console.log("Procesando con Gemini...");
  const result = await model.generateContent(contentParts);

  const outputText = result.response.text();
  console.log(`Respuesta recibida desde Gemini (${outputText.length} caracteres).`);
  
  // Limpieza robusta de JSON (extrae lo que haya entre los primeros [ y últimos ])
  let jsonStr = outputText.trim();
  const start = jsonStr.indexOf('[');
  const end = jsonStr.lastIndexOf(']');
  
  if (start !== -1 && end !== -1) {
    jsonStr = jsonStr.substring(start, end + 1);
  } else {
    // Si no hay brackets, intentamos limpiar markdown básico
    jsonStr = jsonStr.replace(/```json|```/g, '').trim();
  }
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Error parseando JSON de Gemini. Fragmento final:", jsonStr.slice(-50));
    throw new Error("La IA generó un formato de datos inválido. Por favor, intenta de nuevo.");
  }
};
