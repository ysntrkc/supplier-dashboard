import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import swagger from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';

import Routes from './api/routes/index.js';
import LogHelper from './helpers/log.helper.js';
import { connectServer } from './config/db.js';

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ optionsSuccessStatus: 200, origin: true, credentials: true }));
app.options('*', cors());

const port = process.env.PORT || 8000;

connectServer();

const swaggerYaml = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerYaml);
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));

const originalSend = app.response.send;
app.response.send = function sendOverride(body) {
  this.__custombody__ = body;
  return originalSend.call(this, body);
};

app.use(LogHelper.logWithMorgan());

app.use('/api', Routes);

app.get('/health', async (_req, res) => {
  return res.json({
    type: true,
    message: 'Deployment is running!',
  });
});

server.listen(port, () => {
  console.log(`SERVER LISTENING ON ${port}`);
});

export default server;
