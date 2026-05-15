const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:ZgNOnTuxQfDToaIsGZkPzLALjOQdOnfJ@junction.proxy.rlwy.net:56641/railway",
});

client.connect()
  .then(() => {
    console.log('Conectado com sucesso!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Resultado:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('Erro na conexão:', err);
    process.exit(1);
  });
