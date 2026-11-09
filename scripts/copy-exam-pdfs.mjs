// Copia os PDFs dos exames para public/exames e gera src/app/features/exams/exam-files.data.ts
// Uso: node scripts/copy-exam-pdfs.mjs ["G:\Meu Drive\Frederico"]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = process.argv[2] ?? 'G:\\Meu Drive\\Frederico';
const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, '../public/exames');
const outFile = path.join(here, '../src/app/features/exams/exam-files.data.ts');

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

const labs = { 'ACR Cunha': 'ACR Cunha', 'Pet com Pet': 'Pet com Pet' };
const items = [];

for (const file of walk(root)) {
  if (!file.toLowerCase().endsWith('.pdf')) continue;
  const rel = path.relative(root, file).split(path.sep);
  const [lab, folder, name] = rel;
  if (!labs[lab] || rel.length !== 3 || !/^\d{4}-\d{2}-\d{2}$/.test(folder)) continue;

  const dest = path.join(publicDir, lab, folder, name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);

  items.push({
    date: folder,
    lab,
    title: name.replace(/\.pdf$/i, ''),
    url: ['exames', lab, folder, name].map(encodeURIComponent).join('/'),
    sizeMb: Math.round((fs.statSync(file).size / 1048576) * 10) / 10
  });
}

items.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

const header = `// ARQUIVO GERADO por scripts/copy-exam-pdfs.mjs — não edite manualmente.
import { ExamFile } from './exam-file.model';

export const EXAM_FILES: ExamFile[] = `;
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, header + JSON.stringify(items, null, 2) + ';\n', 'utf8');
console.log(`${items.length} PDFs copiados para ${publicDir}`);
