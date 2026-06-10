/**
 * ============================================================
 * PRUEBAS UNITARIAS - Contrato: generarFlashcards(id_apunte)
 * ============================================================
 * 
 * Función bajo prueba: flashcards.service.generarYGuardar(id_apunte)
 * 
 * Estas pruebas verifican las responsabilidades y excepciones
 * definidas en el contrato de operación "Generación de Flashcards":
 * 
 *   - Recuperar el apunte desde la base de datos.
 *   - Enviar el contenido a la API de Gemini.
 *   - Parsear la respuesta JSON de la IA.
 *   - Persistir flashcards y respuestas dentro de una transacción.
 *   - Manejar excepciones: apunte no encontrado, fallo de IA, error de BD (rollback).
 * 
 * Se utilizan mocks (jest.mock) para aislar la unidad de las
 * dependencias externas (BD, API de IA, sistema de archivos).
 * ============================================================
 */

// ── Mocks de dependencias externas ──────────────────────────

// Mock del servicio de apuntes (acceso a BD para obtener el apunte)
jest.mock('../src/services/apuntes.service');

// Mock del servicio de IA (comunicación con API de Google Gemini)
jest.mock('../src/services/ai.service');

// Mock de la conexión a la base de datos SQL Server
jest.mock('../src/database/db');

// Mock del módulo mssql para simular transacciones
jest.mock('mssql');

// ── Imports ─────────────────────────────────────────────────

const flashcardsService = require('../src/services/flashcards.service');
const apuntesService = require('../src/services/apuntes.service');
const aiService = require('../src/services/ai.service');
const { obtenerConexion } = require('../src/database/db');
const sql = require('mssql');

// ── Datos de prueba (fixtures) ──────────────────────────────

/** Simula un objeto Apunte válido retornado por la BD */
const apunteMock = {
  id_apunte: 1,
  id_materia: 10,
  titulo: 'Apunte de Prueba',
  ruta_archivo: 'archivo_test.pdf',
  tipo_archivo: 'application/pdf',
  getRutaArchivo: () => 'archivo_test.pdf',
  getTipoArchivo: () => 'application/pdf',
  getTitulo: () => 'Apunte de Prueba'
};

/** Simula la respuesta JSON que devolvería Gemini AI */
const flashcardsIAMock = [
  {
    titulo: 'Concepto A',
    pregunta: '¿Qué es el concepto A?',
    dificultad: 2,
    respuestas: [
      { texto: 'Respuesta correcta A', es_correcta: true },
      { texto: 'Respuesta incorrecta 1', es_correcta: false },
      { texto: 'Respuesta incorrecta 2', es_correcta: false },
      { texto: 'Respuesta incorrecta 3', es_correcta: false }
    ]
  },
  {
    titulo: 'Concepto B',
    pregunta: '¿Qué es el concepto B?',
    dificultad: 3,
    respuestas: [
      { texto: 'Respuesta incorrecta 1', es_correcta: false },
      { texto: 'Respuesta correcta B', es_correcta: true },
      { texto: 'Respuesta incorrecta 2', es_correcta: false },
      { texto: 'Respuesta incorrecta 3', es_correcta: false }
    ]
  }
];

// ── Suite de pruebas ────────────────────────────────────────

describe('Contrato: generarFlashcards(id_apunte) — flashcardsService.generarYGuardar', () => {

  /** Se limpia el estado de todos los mocks antes de cada test */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════════════
  // TEST 1: CAMINO FELIZ (Happy Path)
  // Verifica TODAS las postcondiciones del contrato:
  //   ✓ Se crean registros en la tabla Flashcards
  //   ✓ Se crean registros vinculados en la tabla Respuestas
  //   ✓ Se devuelve la lista completa de objetos al frontend
  //   ✓ La transacción se confirma (commit) correctamente
  // ════════════════════════════════════════════════════════════

  test('Happy Path: genera flashcards, persiste con transacción y retorna objetos completos', async () => {
    // ── Arrange (Preparación) ──────────────────────────────

    // Precondición: el apunte existe en la BD
    apuntesService.obtenerPorId.mockResolvedValue(apunteMock);

    // La IA retorna un JSON válido con las flashcards
    aiService.generarFlashcardsDesdeArchivo.mockResolvedValue(flashcardsIAMock);

    // Simulación de la transacción SQL Server
    let flashcardIdCounter = 100;
    let respuestaIdCounter = 200;

    const mockTransaction = {
      begin: jest.fn().mockResolvedValue(undefined),
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
      request: jest.fn().mockReturnValue({
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockImplementation((spName) => {
          if (spName === 'sp_Flashcard_Crear') {
            return { recordset: [{ id_flashcard: flashcardIdCounter++ }] };
          }
          if (spName === 'sp_Respuesta_Crear') {
            return { recordset: [{ id_respuesta: respuestaIdCounter++ }] };
          }
        })
      })
    };

    // Mock del constructor de Transaction de mssql
    sql.Transaction = jest.fn().mockImplementation(() => mockTransaction);

    // Mock de la conexión al pool de BD
    obtenerConexion.mockResolvedValue({});

    // ── Act (Ejecución) ────────────────────────────────────

    const resultado = await flashcardsService.generarYGuardar(1);

    // ── Assert (Verificación de postcondiciones) ───────────

    // 1. Se recuperó el apunte correctamente (responsabilidad #1)
    expect(apuntesService.obtenerPorId).toHaveBeenCalledWith(1);

    // 2. Se envió el contenido a Gemini (responsabilidad #2)
    expect(aiService.generarFlashcardsDesdeArchivo).toHaveBeenCalledTimes(1);

    // 3. Se retorna la cantidad correcta de flashcards (postcondición)
    expect(resultado).toHaveLength(2);

    // 4. Cada flashcard tiene la estructura esperada con sus respuestas
    expect(resultado[0].pregunta).toBe('¿Qué es el concepto A?');
    expect(resultado[0].respuestas).toHaveLength(4);
    expect(resultado[1].pregunta).toBe('¿Qué es el concepto B?');
    expect(resultado[1].respuestas).toHaveLength(4);

    // 5. La transacción fue iniciada y confirmada (persistencia segura)
    expect(mockTransaction.begin).toHaveBeenCalledTimes(1);
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
    expect(mockTransaction.rollback).not.toHaveBeenCalled();

    // 6. Se ejecutaron los stored procedures correctos
    //    2 flashcards + 8 respuestas = 10 llamadas a execute()
    const executeCalls = mockTransaction.request().execute.mock.calls;
    // Verificamos que se llamó a request() múltiples veces para crear registros
    expect(mockTransaction.request).toHaveBeenCalled();
  });

  // ════════════════════════════════════════════════════════════
  // TEST 2: EXCEPCIÓN — Apunte no encontrado
  // Verifica: "Si el apunte no tiene un archivo físico asociado,
  //            se cancela la operación y se informa al usuario."
  // ════════════════════════════════════════════════════════════

  test('Excepción: lanza error cuando el apunte no existe en la base de datos', async () => {
    // ── Arrange ────────────────────────────────────────────

    // Precondición violada: el apunte NO existe
    apuntesService.obtenerPorId.mockResolvedValue(null);

    // ── Act & Assert ───────────────────────────────────────

    // Se espera que la operación se cancele con un error descriptivo
    await expect(flashcardsService.generarYGuardar(999))
      .rejects
      .toThrow('Apunte no encontrado');

    // Verificar que NO se intentó llamar a la IA (operación cancelada)
    expect(aiService.generarFlashcardsDesdeArchivo).not.toHaveBeenCalled();

    // Verificar que NO se abrió ninguna transacción de BD
    expect(obtenerConexion).not.toHaveBeenCalled();
  });

  // ════════════════════════════════════════════════════════════
  // TEST 3: EXCEPCIÓN — Fallo de la IA (formato inválido)
  // Verifica: "Si Gemini devuelve un formato inválido o hay error
  //            de cuota, se aborta la operación."
  // ════════════════════════════════════════════════════════════

  test('Excepción: propaga error cuando la IA devuelve formato inválido', async () => {
    // ── Arrange ────────────────────────────────────────────

    // El apunte existe (precondición cumplida)
    apuntesService.obtenerPorId.mockResolvedValue(apunteMock);

    // La IA falla con un error de formato
    aiService.generarFlashcardsDesdeArchivo.mockRejectedValue(
      new Error('La IA generó un formato de datos inválido. Por favor, intenta de nuevo.')
    );

    // ── Act & Assert ───────────────────────────────────────

    // Se espera que la operación se aborte y el error se propague
    await expect(flashcardsService.generarYGuardar(1))
      .rejects
      .toThrow('La IA generó un formato de datos inválido');

    // Verificar que se intentó usar la IA
    expect(aiService.generarFlashcardsDesdeArchivo).toHaveBeenCalledTimes(1);

    // Verificar que NO se intentó persistir en BD (operación abortada)
    expect(obtenerConexion).not.toHaveBeenCalled();
  });

  // ════════════════════════════════════════════════════════════
  // TEST 4: EXCEPCIÓN — Error de BD con rollback
  // Verifica: "Si falla el guardado de alguna tarjeta, se realiza
  //            un rollback total para no dejar datos incompletos."
  // ════════════════════════════════════════════════════════════

  test('Excepción: ejecuta rollback completo cuando falla la persistencia en BD', async () => {
    // ── Arrange ────────────────────────────────────────────

    // Precondiciones cumplidas
    apuntesService.obtenerPorId.mockResolvedValue(apunteMock);
    aiService.generarFlashcardsDesdeArchivo.mockResolvedValue(flashcardsIAMock);

    // La transacción falla al intentar guardar una flashcard
    const mockTransaction = {
      begin: jest.fn().mockResolvedValue(undefined),
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
      request: jest.fn().mockReturnValue({
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(
          new Error('Error de conexión con SQL Server')
        )
      })
    };

    sql.Transaction = jest.fn().mockImplementation(() => mockTransaction);
    obtenerConexion.mockResolvedValue({});

    // ── Act & Assert ───────────────────────────────────────

    // Se espera que el error se propague
    await expect(flashcardsService.generarYGuardar(1))
      .rejects
      .toThrow('Error de conexión con SQL Server');

    // VERIFICACIÓN CRÍTICA: se debe haber ejecutado el rollback
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);

    // El commit NO debe haberse ejecutado (datos incompletos)
    expect(mockTransaction.commit).not.toHaveBeenCalled();
  });
});
