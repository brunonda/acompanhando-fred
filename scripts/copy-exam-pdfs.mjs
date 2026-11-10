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

const labs = { 'ACR Cunha': 'ACR Cunha', 'Pet com Pet': 'Pet com Pet', 'Lillas Pet': 'Lillas Pet' };
const items = [];
const iso = (d) => d.toISOString().slice(0, 10);

/** Descobre a data (YYYY-MM-DD) e o título a partir do caminho; retorna null se não for possível. */
function describe(lab, rel, file) {
  const [, a, b] = rel;
  const name = rel[rel.length - 1];
  const base = name.replace(/\.[^.]+$/, '').trim();

  // <lab>/<YYYY-MM-DD>/<arquivo>
  if (rel.length === 3 && /^\d{4}-\d{2}-\d{2}$/.test(a)) return { date: a, title: base };
  // <lab>/<DD-MM-YYYY>/<arquivo>
  const dmy = rel.length === 3 && a.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dmy) {
    const title = /^receit/i.test(base) ? 'Receituário' : base;
    return { date: `${dmy[3]}-${dmy[2]}-${dmy[1]}`, title };
  }
  // ACR Cunha/Receitas/<DD-MM - ... Receita ...>.pdf (ano 2026)
  if (rel.length === 3 && a === 'Receitas') {
    const m = base.match(/^(\d{2})-(\d{2})(?: - (\d+))? - Receita/);
    if (m) return { date: `2026-${m[2]}-${m[1]}`, title: m[3] ? `Receita ${m[3]}` : 'Receita' };
  }
  // ACR Cunha/Raio X - DD MM/<imagem>
  const rx = rel.length === 3 && a.match(/^Raio X - (\d{2}) (\d{2})$/);
  if (rx) {
    const n = fs.readdirSync(path.dirname(file)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort().indexOf(name) + 1;
    return { date: `2026-${rx[2]}-${rx[1]}`, title: `Raio X - imagem ${n}` };
  }
  // Documentos soltos na pasta do laboratório: usa a data de modificação
  if (rel.length === 2 && /\.pdf$/i.test(name)) return { date: iso(fs.statSync(file).mtime), title: base };
  return null;
}

for (const file of walk(root)) {
  if (!/\.(pdf|jpe?g|png)$/i.test(file)) continue;
  const rel = path.relative(root, file).split(path.sep);
  const lab = rel[0];
  if (!labs[lab]) continue;
  const info = describe(lab, rel, file);
  if (!info) continue;

  const relDest = rel.slice(1);
  const dest = path.join(publicDir, lab, ...relDest);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);

  items.push({
    date: info.date,
    lab,
    title: info.title,
    url: ['exames', lab, ...relDest].map(encodeURIComponent).join('/'),
    sizeMb: Math.round((fs.statSync(file).size / 1048576) * 10) / 10
  });
}

items.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

const header = `// ARQUIVO GERADO por scripts/copy-exam-pdfs.mjs — não edite manualmente.
import { ExamFile } from './exam-file.model';

export const EXAM_FILES: ExamFile[] = `;
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, header + JSON.stringify(items, null, 2) + ';\n', 'utf8');
console.log(`${items.length} arquivos copiados para ${publicDir}`);
