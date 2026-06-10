/**
 * ============================================================
 * PRUEBAS UNITARIAS - Contrato: crearMateria — Validación del Modelo
 * ============================================================
 * 
 * Función bajo prueba: Materia.validar(data)
 * 
 * Estas pruebas verifican la responsabilidad de validación del contrato
 * "Crear Materia": "Validar que los datos mínimos de la materia (nombre)
 * estén presentes" y la excepción "Usuario no autenticado: si no se
 * provee un id_usuario válido, la operación falla por falta de permisos."
 * 
 * A diferencia de los tests de servicio, estas pruebas verifican la
 * lógica del modelo en sí mismo, sin mocks externos, ya que son
 * funciones puras del dominio.
 * ============================================================
 */

// ── Imports ─────────────────────────────────────────────────

const Materia = require('../src/models/Materia');

// ── Suite de pruebas ────────────────────────────────────────

describe('Contrato: crearMateria — Validación de precondiciones (Materia.validar)', () => {

  // ════════════════════════════════════════════════════════════
  // TEST 1: Validación exitosa con datos completos
  // Verifica que la validación pase cuando se cumplen
  // todas las precondiciones del contrato.
  // ════════════════════════════════════════════════════════════

  test('Validación: pasa sin error cuando se proveen id_usuario y nombre_materia', () => {
    // ── Arrange ────────────────────────────────────────────

    const datosValidos = {
      id_usuario: 1,
      nombre_materia: 'Programación Avanzada',
      descripcion: 'Descripción de la materia'
    };

    // ── Act & Assert ───────────────────────────────────────

    // No debe lanzar ninguna excepción
    expect(() => Materia.validar(datosValidos)).not.toThrow();
  });

  // ════════════════════════════════════════════════════════════
  // TEST 2: EXCEPCIÓN — Usuario no autenticado (sin id_usuario)
  // Verifica: "Si no se provee un id_usuario válido, la operación
  //            falla por falta de permisos."
  // ════════════════════════════════════════════════════════════

  test('Excepción: lanza error cuando falta el id_usuario (usuario no autenticado)', () => {
    // ── Arrange ────────────────────────────────────────────

    const datosSinUsuario = {
      nombre_materia: 'Materia huérfana',
      descripcion: 'Sin usuario'
    };

    // ── Act & Assert ───────────────────────────────────────

    // Precondición: "El usuario debe haber iniciado sesión correctamente"
    expect(() => Materia.validar(datosSinUsuario))
      .toThrow('La materia debe pertenecer a un usuario');
  });

  // ════════════════════════════════════════════════════════════
  // TEST 3: EXCEPCIÓN — Nombre de materia vacío
  // Verifica: "Validar que los datos mínimos de la materia
  //            (nombre) estén presentes."
  // ════════════════════════════════════════════════════════════

  test('Excepción: lanza error cuando falta el nombre de la materia', () => {
    // ── Arrange ────────────────────────────────────────────

    const datosSinNombre = {
      id_usuario: 1,
      descripcion: 'Descripción sin nombre'
    };

    // ── Act & Assert ───────────────────────────────────────

    // Responsabilidad: "Validar que los datos mínimos (nombre) estén presentes"
    expect(() => Materia.validar(datosSinNombre))
      .toThrow('El nombre de la materia es obligatorio');
  });

  // ════════════════════════════════════════════════════════════
  // TEST 4: EXCEPCIÓN — Ambos campos obligatorios ausentes
  // Verifica que se reporte el primer error de validación.
  // ════════════════════════════════════════════════════════════

  test('Excepción: lanza error cuando faltan ambos campos obligatorios', () => {
    // ── Arrange ────────────────────────────────────────────

    const datosVacios = {
      descripcion: 'Solo descripción'
    };

    // ── Act & Assert ───────────────────────────────────────

    // Se espera que falle en la primera validación (id_usuario)
    expect(() => Materia.validar(datosVacios))
      .toThrow('La materia debe pertenecer a un usuario');
  });

  // ════════════════════════════════════════════════════════════
  // TEST 5: Creación de instancia Materia válida
  // Verifica la postcondición: el constructor crea una
  // instancia correcta con todos los atributos y getters.
  // ════════════════════════════════════════════════════════════

  test('Postcondición: el constructor crea una instancia Materia con getters funcionales', () => {
    // ── Arrange & Act ──────────────────────────────────────

    const materia = new Materia({
      id_materia: 10,
      id_usuario: 5,
      nombre_materia: '  Base de Datos  ',   // con espacios extra
      descripcion: '  Modelado relacional  ', // con espacios extra
      activo: true
    });

    // ── Assert ─────────────────────────────────────────────

    // El constructor aplica trim() a nombre y descripción
    expect(materia.getNombreMateria()).toBe('Base de Datos');
    expect(materia.getDescripcion()).toBe('Modelado relacional');
    expect(materia.getActivo()).toBe(true);

    // toJSON() retorna la estructura correcta para el frontend
    const json = materia.toJSON();
    expect(json).toEqual({
      id_materia: 10,
      id_usuario: 5,
      nombre_materia: 'Base de Datos',
      descripcion: 'Modelado relacional',
      activo: true
    });
  });
});
