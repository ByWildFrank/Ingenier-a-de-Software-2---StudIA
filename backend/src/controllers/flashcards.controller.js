const flashcardsService = require('../services/flashcards.service');

exports.getFlashcards = async (req, res) => {
    const data = await flashcardsService.obtenerFlashcards();
    res.json(data);
};

exports.createFlashcards = async (req, res) => {
    const { contenido } = req.body;

    const resultado = await flashcardsService.generarFlashcards(contenido);

    res.json({
        mensaje: 'Flashcards generadas correctamente',
        resultado
    });
};
