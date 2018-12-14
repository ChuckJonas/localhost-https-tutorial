import express from 'express';
import https from 'https';
import fs from 'fs';
require('dotenv').config()

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`Hello World`);
})

const httpsOptions = {
  key: fs.readFileSync('./cert/server.key'),
  passphrase: process.env.PASSPHASE,
  cert: fs.readFileSync('./cert/server.crt')
};

const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port);
})