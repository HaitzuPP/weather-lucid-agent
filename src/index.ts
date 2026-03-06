import http, { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';

type Weather = {
  city: string;
  temp_c: number;
  condition: string;
  humidity: number;
};

const sampleWeather = (city: string): Weather => ({
  city,
  temp_c: 22,
  condition: 'Clear',
  humidity: 58,
});

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method !== 'GET' || reqUrl.pathname !== '/weather') {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const city = (reqUrl.searchParams.get('city') || '').trim();
  if (!city) {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'city is required' }));
    return;
  }

  const paymentHeader = req.headers['x-payment'];
  if (!paymentHeader) {
    res.writeHead(402, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Payment required' }));
    return;
  }

  const weather = sampleWeather(city);
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify(weather));
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`weather-agent listening on ${port}`);
});
