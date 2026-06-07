const service = require('../services/respuestas.service');

exports.obtenerPorFlashcard = async (req, res) => {
  try {
    const data = await service.obtenerPorFlashcard(req.params.flashcardId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo respuestas' });
  }
};

exports.crear = async (req, res) => {
  try {
    const nueva = await service.crear(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error creando respuesta' });
  }
};
