// Test de charge : montée progressive jusqu'à 100 utilisateurs simultanés.
// Lancé par : docker compose run --rm loadtest
import http from 'k6/http';
import { check } from 'k6';

const URL = __ENV.TARGET || 'http://front/api/messages';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // montée
    { duration: '1m',  target: 100 },  // charge forte
    { duration: '30s', target: 0 },    // redescente
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],    // moins de 1 % d'erreurs
    http_req_duration: ['p(95)<500'],  // 95 % des réponses en moins de 500 ms
  },
};

export default function () {
  const res = http.get(URL);
  check(res, { 'statut 200': (r) => r.status === 200 });
}