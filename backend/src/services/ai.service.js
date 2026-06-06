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

// Tipos de resultado posibles para el retorno de las estrategias
const TIPO_RESULTADO = Object.freeze({
  TEXTO_EXTRAIDO: 'TEXTO_EXTRAIDO',
  ARCHIVO_NATIVO: 'ARCHIVO_NATIVO'
});

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

// ==========================================
// PATRÓN STRATEGY (Implementación formal con Clases ES6)
// ==========================================

/**
 * Clase Abstracta - EstrategiaExtraccion
 * Define el contrato que todas las estrategias concretas deben cumplir.
 * Ninguna instancia de esta clase debe usarse directamente.
 */
class EstrategiaExtraccion {
  /**
   * Determina si esta estrategia puede procesar un archivo con la extensión dada.
   * @param {string} extension - La extensión del archivo (ej: '.docx', '.pptx').
   * @returns {boolean}
   */
  soporta(extension) {
    throw new Error('El método soporta() debe ser implementado por la estrategia concreta.');
  }

  /**
   * Extrae el texto del archivo ubicado en la ruta proporcionada.
   * @param {string} rutaArchivo - Ruta absoluta al archivo.
   * @returns {Promise<{tipo: string, datos: object}>} Objeto tipado con el resultado de la estrategia.
   */
  async extraerTexto(rutaArchivo) {
    throw new Error('El método extraerTexto() debe ser implementado por la estrategia concreta.');
  }
}

/**
 * Estrategia Concreta - Extracción de texto para archivos Word (.docx, .doc)
 * Utiliza la librería mammoth para convertir el documento a texto plano.
 */
class EstrategiaDocx extends EstrategiaExtraccion {
  soporta(extension) {
    return extension === '.docx' || extension === '.doc';
  }

  async extraerTexto(rutaArchivo) {
    console.log("Extrayendo texto del DOCX con mammoth...");
    const result = await mammoth.extractRawText({ path: rutaArchivo });
    return { tipo: TIPO_RESULTADO.TEXTO_EXTRAIDO, datos: { texto: result.value } };
  }
}

/**
 * Estrategia Concreta - Extracción de texto para archivos PowerPoint (.pptx, .ppt)
 * Descomprime el archivo OOXML y parsea el texto de las diapositivas.
 */
class EstrategiaPptx extends EstrategiaExtraccion {
  soporta(extension) {
    return extension === '.pptx' || extension === '.ppt';
  }

  async extraerTexto(rutaArchivo) {
    console.log("Extrayendo texto del PPT/PPTX...");
    try {
      const AdmZip = require('adm-zip');
      const zip = new AdmZip(rutaArchivo);
      const entries = zip.getEntries();
      let text = '';
      for (const entry of entries) {
        if (entry.entryName.startsWith('ppt/slides/slide') && entry.entryName.endsWith('.xml')) {
          const xml = entry.getData().toString('utf8');
          const matches = xml.match(/<a:t>([^<]*)<\/a:t>/g);
          if (matches) {
            text += matches.map(m => m.replace(/<\/?a:t>/g, '')).join(' ') + '\n\n';
          }
        }
      }
      const textoFinal = text || 'No se pudo extraer texto del archivo.';
      return { tipo: TIPO_RESULTADO.TEXTO_EXTRAIDO, datos: { texto: textoFinal } };
    } catch (e) {
      console.error("Error extrayendo PPT:", e.message);
      return { tipo: TIPO_RESULTADO.TEXTO_EXTRAIDO, datos: { texto: 'No se pudo extraer texto del archivo.' } };
    }
  }
}

/**
 * Estrategia Concreta - Delegación nativa a Gemini
 * Actúa como estrategia por defecto para formatos que Gemini procesa directamente
 * (PDF, imágenes, texto plano). Retorna ARCHIVO_NATIVO para señalar que no se requiere extracción local.
 */
class EstrategiaNativaGemini extends EstrategiaExtraccion {
  soporta(extension) {
    return true; // Estrategia por defecto si ninguna anterior coincide
  }

  async extraerTexto(rutaArchivo) {
    return { tipo: TIPO_RESULTADO.ARCHIVO_NATIVO, datos: { rutaArchivo } };
  }
}

// Colección de instancias de estrategias disponibles
const estrategiasDeExtraccion = [new EstrategiaDocx(), new EstrategiaPptx(), new EstrategiaNativaGemini()];

/**
 * Extrae texto delegando la tarea a la estrategia correspondiente según la extensión.
 * @param {string} filePath - Ruta al archivo a procesar.
 * @returns {Promise<{tipo: string, datos: object}>} Objeto tipado con el resultado de la estrategia.
 */
async function extraerTextoSiEsNecesario(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Seleccionamos la estrategia dinámicamente en tiempo de ejecución
  const estrategia = estrategiasDeExtraccion.find(e => e.soporta(ext));
  
  // Ejecutamos la estrategia (polimorfismo real mediante herencia)
  return await estrategia.extraerTexto(filePath);
}

exports.extraerTextoSiEsNecesario = extraerTextoSiEsNecesario;
exports.TIPO_RESULTADO = TIPO_RESULTADO;

/**
 * Extrae el primer arreglo JSON completo de un string usando balance de corchetes.
 * Maneja correctamente strings con caracteres escapados y estructuras anidadas.
 * @param {string} str - El string que contiene el JSON.
 * @returns {string|null} El substring del arreglo JSON balanceado, o null si no se encuentra.
 */
function extraerArregloJSON(str) {
  const inicio = str.indexOf('[');
  if (inicio === -1) return null;

  let profundidad = 0;
  let enString = false;
  let escape = false;

  for (let i = inicio; i < str.length; i++) {
    const ch = str[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && enString) { escape = true; continue; }
    if (ch === '"') { enString = !enString; continue; }
    if (enString) continue;
    if (ch === '[') profundidad++;
    if (ch === ']') {
      profundidad--;
      if (profundidad === 0) return str.substring(inicio, i + 1);
    }
  }
  return null;
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
  const resultado = await extraerTextoSiEsNecesario(filePath);
  let contentParts;

  if (resultado.tipo === TIPO_RESULTADO.TEXTO_EXTRAIDO) {
    // Estrategia TEXTO: enviar el contenido extraído directamente como texto
    console.log(`Texto extraído correctamente (${resultado.datos.texto.length} caracteres). Enviando a Gemini como texto...`);
    contentParts = [
      `Contenido del documento "${displayName}":\n\n${resultado.datos.texto}`,
      FLASHCARD_PROMPT
    ];
  } else if (resultado.tipo === TIPO_RESULTADO.ARCHIVO_NATIVO) {
    
    // Estrategia ARCHIVO: subir a Gemini File API (PDF, imágenes, texto)
    const ext = path.extname(resultado.datos.rutaArchivo).toLowerCase();
    const resolvedMime = GEMINI_SUPPORTED_MIMES[ext] || 'application/octet-stream';
    console.log(`Subiendo archivo a Gemini: ${resultado.datos.rutaArchivo} (${resolvedMime})`);

    const uploadResponse = await fileManager.uploadFile(resultado.datos.rutaArchivo, {
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
  
  // Limpieza robusta de JSON con múltiples estrategias de parseo
  let jsonStr = outputText.trim().replace(/```json|```/g, '').trim();
  
  // Intento 1: parsear directamente (responseMimeType debería dar JSON válido)
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) return parsed;
    // Si Gemini envolvió el arreglo en un objeto, extraer el primer arreglo encontrado
    const arr = Object.values(parsed).find(v => Array.isArray(v));
    if (arr) return arr;
  } catch (_) {}

  // Intento 2: extraer el arreglo JSON usando balance de corchetes
  const arregloExtraido = extraerArregloJSON(jsonStr);
  if (arregloExtraido) {
    try {
      return JSON.parse(arregloExtraido);
    } catch (_) {}
  }

  console.error("Error parseando JSON de Gemini. Fragmento final:", jsonStr.slice(-80));
  throw new Error("La IA generó un formato de datos inválido. Por favor, intenta de nuevo.");
};
