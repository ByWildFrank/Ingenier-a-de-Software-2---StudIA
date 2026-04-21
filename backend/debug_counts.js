const { getConnection } = require('./src/database/db');

async function run() {
  try {
    const pool = await getConnection();
    console.log("--- DEBUGGING COUNTS ---");
    
    // Check specific note ISII
    const res = await pool.request().query(`
      SELECT a.id_apunte, a.titulo, a.activo as apunte_activo,
             (SELECT COUNT(*) FROM Flashcard f WHERE f.id_apunte = a.id_apunte) as total_fc,
             (SELECT COUNT(*) FROM Flashcard f WHERE f.id_apunte = a.id_apunte AND f.activa = 1) as activa_1,
             (SELECT COUNT(*) FROM Flashcard f WHERE f.id_apunte = a.id_apunte AND f.activo = 1) as activo_1,
             (SELECT COUNT(*) FROM Flashcard f WHERE f.id_apunte = a.id_apunte AND f.activa = 'true') as activa_true,
             (SELECT COUNT(*) FROM Flashcard f WHERE f.id_apunte = a.id_apunte AND f.activa = '1') as activa_str_1
      FROM Apunte a
      WHERE a.titulo LIKE '%ISII%'
    `);
    console.log(JSON.stringify(res.recordset, null, 2));

    // Check one flashcard to see types
    const fc = await pool.request().query("SELECT TOP 1 * FROM Flashcard WHERE id_apunte IN (SELECT id_apunte FROM Apunte WHERE titulo LIKE '%ISII%')");
    if (fc.recordset.length > 0) {
      console.log("--- FLASHCARD SAMPLE ---");
      console.log(fc.recordset[0]);
      console.log("Types:", {
        activa: typeof fc.recordset[0].activa,
        activo: typeof fc.recordset[0].activo
      });
    }

  } catch (e) {
    console.error(e);
  }
}
run();
