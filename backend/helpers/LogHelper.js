import morgan from 'morgan';

import db from '../config/db.js';

class LogHelper {
  static logWithMorgan() {
    morgan.token('reqBody', (req) => {
      const body = req.body || {};
      const params = req.params || {};
      return JSON.stringify({ body, params });
    });

    morgan.token('decoded', (req) => {
      return JSON.stringify(req.decoded ? req.decoded : {});
    });

    morgan.token('resBody', (_req, res) => {
      return res.__custombody__ === undefined ? JSON.stringify({}) : res.__custombody__;
    });

    return morgan(
      `{
      "method": ":method",
      "url": ":url",
      "status": ":status",
      "remote_address": ":remote-addr",
      "response_time": ":response-time",
      "agent": ":user-agent",
      "date": ":date[iso]",
      "decoded": :decoded,
      "request_body": :reqBody,
      "response_body": :resBody
    }`,
      {
        skip: (req) => {
          const url = req.originalUrl;

          if (url.slice(0, 9) === '/api-docs') {
            return true;
          }

          return url === '/' || url === '/static';
        },
        stream: {
          write: async (message) => {
            const jsonMessage = JSON.parse(message);
            delete jsonMessage.response_body.data;
            if (jsonMessage.method === 'OPTIONS') {
              return;
            }
            if (Number(jsonMessage.status) === 401) {
              return;
            }
            if (jsonMessage.request_body.body.password) {
              jsonMessage.request_body.body.password = '********';
            }
            if (jsonMessage.decoded.iat) {
              delete jsonMessage.decoded.iat;
            }
            if (jsonMessage.decoded.exp) {
              delete jsonMessage.decoded.exp;
            }
            if (jsonMessage.response_time === '-') {
              jsonMessage.response_time = 0;
            }
            if (jsonMessage.status === '-') {
              jsonMessage.status = 0;
            }

            await db('logs').create(jsonMessage);
          },
        },
      }
    );
  }
}

export default LogHelper;
