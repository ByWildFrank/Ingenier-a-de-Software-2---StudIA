const service = require('../services/respuestas.service');

exports.getByFlashcard = async (req, res) => {
  try {
    const data = await service.getByFlashcard(req.params.flashcardId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo respuestas' });
  }
};

exports.create = async (req, res) => {
  try {
    const nueva = await service.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error creando respuesta' });
  }
};
