const { getConnection } = require('../database/db');
const sql = require('mssql');
const aiService = require('./ai.service');
const apuntesService = require('./apuntes.service');
const path = require('path');

exports.getByApunte = async (id_apunte) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_apunte', id_apunte)
    .execute('sp_Flashcard_ObtenerPorApunte');
  
  const flashcards = result.recordset;
  return await loadAnswersForFlashcards(pool, flashcards);
};

// Función auxiliar para cargar respuestas de una lista de flashcards
async function loadAnswersForFlashcards(pool, flashcards) {
  for (const fc of flashcards) {
    const respResult = await pool.request()
      .input('id_flashcard', fc.id_flashcard)
      .execute('sp_Respuesta_ObtenerPorFlashcard');
    fc.respuestas = respResult.recordset;
  }
  return flashcards;
}

exports.getByMateriaWithAnswers = async (id_materia) => {
  const pool = await getConnection();
  const fcResult = await pool.request()
    .input('id_materia', id_materia)
    .execute('sp_Flashcard_ObtenerPorMateria');

  const flashcards = fcResult.recordset;
  return await loadAnswersForFlashcards(pool, flashcards);
};

exports.saveProgress = async (data) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_usuario', data.id_usuario)
    .input('id_materia', data.id_materia)
    .input('avance_porcentual', data.avance_porcentual)
    .input('comentarios', data.comentarios)
    .execute('sp_Progreso_Crear');

  return { id_progreso: Object.values(result.recordset[0])[0], ...data };
};

exports.generateAndSave = async (id_apunte) => {
  // 1. Obtener la metadata del Apunte
  const apunte = await apuntesService.getById(id_apunte);
  if (!apunte) throw new Error("Apunte no encontrado");

  // 2. Resolver la ruta física
  const filePath = path.join(__dirname, '../../uploads', apunte.ruta_archivo);

  // 3. Obtener Flashcards desde Gemini AI
  const flashcardsJson = await aiService.generateFlashcardsFromFile(
    filePath, 
    apunte.tipo_archivo, 
    apunte.titulo
  );

  const pool = await getConnection();
  const resultados = [];

  // 4. Guardar en Base de Datos usando Transaction para masividad
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    for (const fc of flashcardsJson) {
      // Create Flashcard
      const reqFC = transaction.request()
        .input('id_apunte', id_apunte)
        .input('titulo', fc.titulo || 'Sin título')
        .input('pregunta', fc.pregunta)
        .input('dificultad', fc.dificultad)
        .input('activa', 1);
      
      const resFC = await reqFC.execute('sp_Flashcard_Crear');
      const newFlashcardId = Object.values(resFC.recordset[0])[0];
      
      const flashcardResult = {
        id_flashcard: newFlashcardId,
        titulo: fc.titulo || 'Sin título',
        pregunta: fc.pregunta,
        dificultad: fc.dificultad,
        respuestas: []
      };

      // Create Answers
      for (const resp of fc.respuestas) {
        const reqR = transaction.request()
          .input('id_flashcard', newFlashcardId)
          .input('texto_respuesta', resp.texto || resp.texto_respuesta)
          .input('es_correcta', resp.es_correcta);
          
        const resR = await reqR.execute('sp_Respuesta_Crear');
        const newRespuestaId = Object.values(resR.recordset[0])[0];
        flashcardResult.respuestas.push({
          id_respuesta: newRespuestaId,
          texto: resp.texto || resp.texto_respuesta,
          es_correcta: resp.es_correcta
        });
      }
      
      resultados.push(flashcardResult);
    }
    
    await transaction.commit();
    return resultados;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
