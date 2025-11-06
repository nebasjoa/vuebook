import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = resolve(__dirname, '../package.json');
const envPath = resolve(__dirname, '../.env');

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const version = pkg.version;

// Load existing .env (if it exists)
let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';

// Remove existing VITE_APP_VERSION line
envContent = envContent
    .split('\n')
    .filter(line => !line.startsWith('VITE_APP_VERSION='))
    .join('\n')
    .trim();

// Add the new version line at the end
envContent += `\nVITE_APP_VERSION=${version}\n`;

writeFileSync(envPath, envContent);
console.log(`✅ Injected version ${version} into .env without overwriting existing values.`);