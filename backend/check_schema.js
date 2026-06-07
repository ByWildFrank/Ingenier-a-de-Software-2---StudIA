const { getConnection } = require('./src/database/db'); 

async function run() { 
  try { 
    const pool = await getConnection(); 
    
    console.log("--- PROGRESO TABLE ---");
    const prog = await pool.request().query("SELECT TOP 0 * FROM Progreso");
    console.log("Columns:", Object.keys(prog.recordset.columns));

    console.log("--- MATERIA TABLE ---");
    const mat = await pool.request().query("SELECT TOP 0 * FROM Materia");
    console.log("Columns:", Object.keys(mat.recordset.columns));

    console.log("--- APUNTE TABLE ---");
    const apu = await pool.request().query("SELECT TOP 0 * FROM Apunte");
    console.log("Columns:", Object.keys(apu.recordset.columns));

    console.log("--- FLASHCARD TABLE ---");
    const fla = await pool.request().query("SELECT TOP 0 * FROM Flashcard");
    console.log("Columns:", Object.keys(fla.recordset.columns));

    console.log("--- LATEST PROGRESS ---");
    const latest = await pool.request().query("SELECT TOP 5 * FROM Progreso ORDER BY id_progreso DESC");
    console.log(latest.recordset);

  } catch(e) { 
    console.error(e); 
  } 
} 
run();
