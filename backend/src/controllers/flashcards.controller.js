const service = require('../services/flashcards.service');

exports.getByApunte = async (req, res) => {
  try {
    const data = await service.getByApunte(req.params.apunteId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo flashcards' });
  }
};

exports.getByMateria = async (req, res) => {
  try {
    const data = await service.getByMateriaWithAnswers(req.params.materiaId);
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo flashcards por materia:", error);
    res.status(500).json({ error: 'Error obteniendo flashcards por materia' });
  }
};

exports.generate = async (req, res) => {
  try {
    const { id_apunte } = req.body;
    if (!id_apunte) {
      return res.status(400).json({ error: 'Debes enviar el id_apunte' });
    }
    
    const generadas = await service.generateAndSave(id_apunte);
    res.status(201).json(generadas);
  } catch (error) {
    console.error("Error en generate:", error);
    res.status(500).json({ error: 'Error generando flashcards mediante IA' });
  }
};

exports.saveProgress = async (req, res) => {
  try {
    const { id_materia, aciertos, total, porcentaje } = req.body;
    const data = {
      id_usuario: req.body.id_usuario,
      id_materia,
      avance_porcentual: porcentaje,
      comentarios: `Examen: ${aciertos}/${total} correctas (${porcentaje}%)`
    };
    const result = await service.saveProgress(data);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error guardando progreso:", error);
    res.status(500).json({ error: 'Error guardando progreso' });
  }
};
