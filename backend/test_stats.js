const http = require('http');

async function testStats(userId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/materias/stats?id_usuario=${userId}`,
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
    console.log("Testing stats for user 11...");
    const stats = await testStats(11);
    console.log("Stats result count:", stats.length);
    if (stats.length > 0) {
      console.log("First materia stats:", JSON.stringify(stats[0], null, 2));
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

run();
