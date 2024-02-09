import httpProxy from 'http-proxy';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.API_URL || 'http://localhost:4508/';

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  return new Promise((resolve, reject) => {
    proxy.web(request, response, { target: API_URL, changeOrigin: true }, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};
