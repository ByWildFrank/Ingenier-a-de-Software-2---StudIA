const http = require('http');

async function test(materiaId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/apuntes/materia/${materiaId}`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`BODY: ${body}`);
        resolve(JSON.parse(body));
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  try {
    // We don't know the exact materia ID from the screenshot, 
    // but we can try to find it by name or just check the latest materia.
    const { getConnection } = require('./src/database/db');
    const pool = await getConnection();
    const mat = await pool.request().query("SELECT TOP 1 id_materia FROM Materia WHERE nombre_materia LIKE '%Ingenieria%' ORDER BY id_materia DESC");
    if (mat.recordset.length > 0) {
      const id = mat.recordset[0].id_materia;
      console.log(`Testing for Materia ID: ${id}`);
      await test(id);
    } else {
      console.log("Materia not found");
    }
  } catch (e) {
    console.error(e);
  }
}
run();
