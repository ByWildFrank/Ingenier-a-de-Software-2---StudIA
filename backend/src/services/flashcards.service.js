exports.obtenerFlashcards = async () => {
    return [
        { pregunta: "¿Qué es una flashcard?", respuesta: "Una tarjeta de estudio." }
    ];
};

exports.generarFlashcards = async (contenido) => {
    // Acá después conectamos la IA
    return [
        { pregunta: "Pregunta generada", respuesta: "Respuesta generada" }
    ];
};
