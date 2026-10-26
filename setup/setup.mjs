import { createInterface } from 'node:readline';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

const PROJECT = '/project';
const databases = JSON.parse(readFileSync(new URL('./databases.json', import.meta.url)));
const keys = Object.keys(databases);
const rl = createInterface({ input: process.stdin });
const lines = rl[Symbol.asyncIterator]();


async function ask(question, fallback) {
  process.stdout.write(`${question} [${fallback}] : `);
  const { value, done } = await lines.next();
  if (done) process.stdout.write('\n');
  const answer = done ? '' : value.trim();
  return answer || fallback;
}

async function askIdentifier(question, fallback) {
  for (;;) {
    const value = await ask(question, fallback);
    if (/^[a-z][a-z0-9_]{0,30}$/.test(value)) return value;
    console.log('  -> minuscules, chiffres et _ uniquement, commençant par une lettre.');
  }
}

async function askReplicas(question, fallback) {
  for(;;){
    const value = await ask(question, fallback);
    if (/^\d+$/.test(value) && Number(value) > 0 && Number(value) <= 10) return Number(value);
    console.log('  -> veuillez entrer un nombre entre 1 et 10.');
  }
}

const password = () => randomBytes(18).toString('base64url');

function writeSecret(name, value, overwrite) {
  const file = `${PROJECT}/dockerServer/secrets/${name}`;
  if (existsSync(file) && !overwrite) return;
  writeFileSync(file, value, { mode: 0o644 });
}

console.log('\n=== Configuration du projet Tomcat ===\n');

if (existsSync(`${PROJECT}/.env`)) {
  const again = await ask('Un .env existe déjà. Le remplacer ? (o/n)', 'n');
  if (!again.toLowerCase().startsWith('o')) {
    console.log('Rien n\'a été modifié.');
    process.exit(0);
  }
}

console.log('Bases disponibles (taper 1, 2 ou 3 pour choisir la base de données):');
keys.forEach((k, i) => console.log(`  ${i + 1}) ${databases[k].label}`));
let db;
while (!db) {
  const choice = await ask('Votre choix', '1');
  db = keys[Number(choice) - 1] ?? (keys.includes(choice) ? choice : undefined);
  if (!db) console.log('  -> choix invalide.');
}

const dbName = await askIdentifier('Nom de la base', 'app');
const dbUser = await askIdentifier('Utilisateur', 'app');
const dbReplicas = await askReplicas('Nombre de réplicas', '1');
const newPasswords = (await ask('Générer de nouveaux mots de passe ? (o/n)', 'o'))
  .toLowerCase().startsWith('o');
rl.close();

mkdirSync(`${PROJECT}/dockerServer/secrets`, { recursive: true });
writeSecret('db-password', password(), newPasswords);
writeSecret('manager-password', password(), newPasswords);
if (databases[db].rootPassword) writeSecret('db-root-password', password(), newPasswords);

writeFileSync(`${PROJECT}/.env`, `# Généré par "docker compose run --rm setup" - base : ${databases[db].label}
# Fichiers chargés par Compose : socle commun + fragment de la base choisie
COMPOSE_FILE=docker-compose.yml;dockerServer/db/${db}.yaml
COMPOSE_PATH_SEPARATOR=;

DB_NAME=${dbName}
DB_USER=${dbUser}
NB_REPLICAS=${dbReplicas}
`);

console.log(`
OK : ${databases[db].label}, base "${dbName}", utilisateur "${dbUser}".
`);