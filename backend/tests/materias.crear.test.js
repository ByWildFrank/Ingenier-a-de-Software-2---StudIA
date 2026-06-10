/**
 * ============================================================
 * PRUEBAS UNITARIAS - Contrato: crearMateria(id_usuario, nombre_materia, descripcion)
 * ============================================================
 * 
 * Función bajo prueba: materias.service.crear(data)
 * 
 * Estas pruebas verifican las responsabilidades y excepciones
 * definidas en el contrato de operación "Crear Materia":
 * 
 *   - Validar que los datos mínimos (nombre) estén presentes.
 *   - Establecer conexión con la base de datos SQL Server.
 *   - Ejecutar el procedimiento almacenado sp_Materia_Crear.
 *   - Asociar la nueva materia al ID del usuario creador.
 *   - Manejar excepciones: usuario no autenticado, error de conexión SQL,
 *     nombre duplicado.
 * 
 * Se utilizan mocks (jest.mock) para aislar la unidad de las
 * dependencias externas (BD SQL Server).
 * ============================================================
 */

// ── Mocks de dependencias externas ──────────────────────────

// Mock de la conexión a la base de datos SQL Server
jest.mock('../src/database/db');

// ── Imports ─────────────────────────────────────────────────

const materiasService = require('../src/services/materias.service');
const { obtenerConexion } = require('../src/database/db');
const Materia = require('../src/models/Materia');

// ── Suite de pruebas ────────────────────────────────────────

describe('Contrato: crearMateria(id_usuario, nombre_materia, descripcion) — materiasService.crear', () => {

  /** Se limpia el estado de todos los mocks antes de cada test */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════════════
  // TEST 1: CAMINO FELIZ (Happy Path)
  // Verifica TODAS las postcondiciones del contrato:
  //   ✓ Se inserta una nueva fila en la tabla Materias
  //   ✓ Se obtiene el nuevo id_materia generado automáticamente
  //   ✓ El objeto retornado es una instancia de Materia con datos correctos
  //   ✓ Se asocia la materia al id_usuario del creador
  // ════════════════════════════════════════════════════════════

  test('Happy Path: crea materia, ejecuta sp_Materia_Crear y retorna objeto Materia con id generado', async () => {
    // ── Arrange (Preparación) ──────────────────────────────

    const datosEntrada = {
      id_usuario: 5,
      nombre_materia: 'Ingeniería de Software II',
      descripcion: 'Materia de 4to año de Ingeniería en Sistemas'
    };

    // El id_materia que generaría automáticamente SQL Server
    const idGenerado = 42;

    // Simulación del pool de conexión y la ejecución del SP
    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [{ id_materia: idGenerado }]
      })
    };

    const mockPool = {
      request: jest.fn().mockReturnValue(mockRequest)
    };

    obtenerConexion.mockResolvedValue(mockPool);

    // ── Act (Ejecución) ────────────────────────────────────

    const resultado = await materiasService.crear(datosEntrada);

    // ── Assert (Verificación de postcondiciones) ───────────

    // 1. Se estableció conexión con la BD (responsabilidad #2)
    expect(obtenerConexion).toHaveBeenCalledTimes(1);

    // 2. Se ejecutó el stored procedure correcto (responsabilidad #3)
    expect(mockRequest.execute).toHaveBeenCalledWith('sp_Materia_Crear');

    // 3. Se pasaron los parámetros correctos al SP
    expect(mockRequest.input).toHaveBeenCalledWith('id_usuario', 5);
    expect(mockRequest.input).toHaveBeenCalledWith('nombre_materia', 'Ingeniería de Software II');
    expect(mockRequest.input).toHaveBeenCalledWith('descripcion', 'Materia de 4to año de Ingeniería en Sistemas');

    // 4. El resultado es una instancia de Materia (postcondición)
    expect(resultado).toBeInstanceOf(Materia);

    // 5. El id_materia generado automáticamente se asignó correctamente
    expect(resultado.id_materia).toBe(idGenerado);

    // 6. La materia está asociada al usuario correcto (responsabilidad #4)
    expect(resultado.id_usuario).toBe(5);
    expect(resultado.nombre_materia).toBe('Ingeniería de Software II');
    expect(resultado.descripcion).toBe('Materia de 4to año de Ingeniería en Sistemas');
  });

  // ════════════════════════════════════════════════════════════
  // TEST 2: EXCEPCIÓN — Error de conexión SQL Server
  // Verifica: "Si el servidor de base de datos no responde,
  //            se lanza una excepción de persistencia."
  // ════════════════════════════════════════════════════════════

  test('Excepción: lanza error cuando falla la conexión a SQL Server', async () => {
    // ── Arrange ────────────────────────────────────────────

    const datosEntrada = {
      id_usuario: 5,
      nombre_materia: 'Base de Datos',
      descripcion: 'Materia sobre modelado de datos'
    };

    // Simular que el servidor de BD no responde
    obtenerConexion.mockRejectedValue(
      new Error('Failed to connect to localhost:1433 - Could not connect')
    );

    // ── Act & Assert ───────────────────────────────────────

    // Se espera que la excepción de persistencia se propague al usuario
    await expect(materiasService.crear(datosEntrada))
      .rejects
      .toThrow('Failed to connect to localhost:1433');

    // Se intentó conectar pero falló
    expect(obtenerConexion).toHaveBeenCalledTimes(1);
  });

  // ════════════════════════════════════════════════════════════
  // TEST 3: EXCEPCIÓN — Usuario inexistente (violación de FK)
  // Verifica: "Si no se provee un id_usuario válido, la operación
  //            falla." La tabla Materia tiene FK_Materia_Usuario
  //            que referencia a Usuario(id_usuario). Si el usuario
  //            no existe, SQL Server rechaza la inserción.
  // Nota: La tabla Materia NO tiene restricción UNIQUE sobre
  //       nombre_materia (la PK es id_materia), por lo que sí
  //       se permiten nombres de materia duplicados.
  // ════════════════════════════════════════════════════════════

  test('Excepción: lanza error cuando el id_usuario no existe en la tabla Usuario (FK)', async () => {
    // ── Arrange ────────────────────────────────────────────

    const datosEntrada = {
      id_usuario: 99999, // Usuario que no existe en la tabla Usuario
      nombre_materia: 'Materia Sin Dueño',
      descripcion: 'Este usuario no existe'
    };

    // Simular error de FK de SQL Server (FK_Materia_Usuario)
    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockRejectedValue(
        new Error('The INSERT statement conflicted with the FOREIGN KEY constraint "FK_Materia_Usuario". The conflict occurred in database "StudIA", table "dbo.Usuario", column \'id_usuario\'.')
      )
    };

    const mockPool = {
      request: jest.fn().mockReturnValue(mockRequest)
    };

    obtenerConexion.mockResolvedValue(mockPool);

    // ── Act & Assert ───────────────────────────────────────

    // Se espera que el error de FK de SQL Server se propague
    await expect(materiasService.crear(datosEntrada))
      .rejects
      .toThrow('FOREIGN KEY constraint "FK_Materia_Usuario"');

    // Se intentó ejecutar el SP pero SQL rechazó por FK inválida
    expect(mockRequest.execute).toHaveBeenCalledWith('sp_Materia_Crear');
  });

  // ════════════════════════════════════════════════════════════
  // TEST 4: Descripción opcional (valor por defecto)
  // Verifica que la descripción use '' cuando no se proporciona.
  // ════════════════════════════════════════════════════════════

  test('Comportamiento: asigna string vacío cuando no se proporciona descripción', async () => {
    // ── Arrange ────────────────────────────────────────────

    const datosEntrada = {
      id_usuario: 3,
      nombre_materia: 'Matemática I'
      // Sin descripción
    };

    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [{ id_materia: 99 }]
      })
    };

    const mockPool = {
      request: jest.fn().mockReturnValue(mockRequest)
    };

    obtenerConexion.mockResolvedValue(mockPool);

    // ── Act ────────────────────────────────────────────────

    const resultado = await materiasService.crear(datosEntrada);

    // ── Assert ─────────────────────────────────────────────

    // Se envió '' como descripción por defecto (validación de datos mínimos)
    expect(mockRequest.input).toHaveBeenCalledWith('descripcion', '');

    // El resultado sigue siendo válido
    expect(resultado).toBeInstanceOf(Materia);
    expect(resultado.nombre_materia).toBe('Matemática I');
  });
});
