// Extrai os resultados dos exames (PDFs) e gera src/app/features/dashboard/exams.data.ts
// Uso: node scripts/extract-exams.mjs ["G:\Meu Drive\Frederico"]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = process.argv[2] ?? 'G:\\Meu Drive\\Frederico';
const outFile = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/app/features/dashboard/exams.data.ts'
);

async function pdfText(file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await getDocument({ data, useSystemFonts: true, verbosity: 0 }).promise;
  let out = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const tc = await (await doc.getPage(p)).getTextContent();
    let lastY = null;
    let line = '';
    for (const it of tc.items) {
      const y = it.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        out += line.trim() + '\n';
        line = '';
      }
      line += it.str + ' ';
      lastY = y;
    }
    out += line.trim() + '\n';
  }
  return out;
}

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

// "1.200" -> 1200 ; "3,46" -> 3.46 ; "1.056" -> 1056
function num(s) {
  if (s === undefined) return undefined;
  const hasComma = s.includes(',');
  const v = hasComma ? s.replace(/\./g, '').replace(',', '.') : s.replace(/\./g, '');
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const N = '([\\d.,]+)';
const first = (text, re) => {
  const m = text.match(re);
  return m ? num(m[1]) : undefined;
};

// Alguns laudos têm erros de digitação nos valores absolutos; recalcula a partir do % e do total de leucócitos.
const leucAcr = (t) => first(t, new RegExp(`Leucócitos ${N} \\(`));
function leucPetlove(t) {
  const raw = t.match(new RegExp(`Leucócitos Totais ${N}`))?.[1];
  if (raw === undefined) return undefined;
  return /^\d,\d{3}$/.test(raw) ? Number(raw.replace(',', '')) : num(raw);
}
function absFromPct(t, _label, total, pctRe) {
  const pct = first(t, new RegExp(pctRe));
  if (pct === undefined || total === undefined) return undefined;
  return Math.round((pct * total) / 100);
}

/** Laboratório ACR Cunha */function parseAcr(t) {
  return {
    hemacias: first(t, new RegExp(`Hemácias ${N} \\(`)),
    hemoglobina: first(t, new RegExp(`Hemoglobina ${N} g/dL`)),
    hematocrito: first(t, new RegExp(`Hematócrito ${N} %`)),
    leucocitos: leucAcr(t),
    neutrofilos: absFromPct(t, 'Segmentados', leucAcr(t), `Segmentados ${N}%`),
    linfocitos: absFromPct(t, 'Linfócitos', leucAcr(t), `Linfócitos ${N}%`),
    plaquetas: first(t, new RegExp(`Plaquetas ${N} \\(`)),
    creatinina: first(t, new RegExp(`Creatinina ${N} mg/dL`)),
    ureia: first(t, new RegExp(`Ureia ${N} mg/dL`)),
    alt: first(t, new RegExp(`ALT \\(TGP\\) ${N}`)),
    fosfataseAlcalina: first(t, new RegExp(`Fosfatase alcalina ${N}`)),
  };
}

/** Laboratório Pet com Pet / Petlove */
function parsePetlove(t) {
  const res = (name) => first(t, new RegExp(`${name}.{0,120}?RESULTADO\\.+: ${N}`));
  let plaquetas = first(t, new RegExp(`Plaquetas ${N}`));
  if (plaquetas !== undefined && plaquetas < 1000) plaquetas *= 1000;
  return {
    hemacias: first(t, new RegExp(`Hemácias ${N} [\\d,]+ -`)),
    hemoglobina: first(t, new RegExp(`Hemoglobina ${N} [\\d,]+ -`)),
    hematocrito: first(t, new RegExp(`Volume Globular ${N}`)),
    leucocitos: leucPetlove(t),
    neutrofilos: absFromPct(t, 'Segmentados', leucPetlove(t), `Segmentados ${N} `),
    linfocitos: absFromPct(t, 'Linfócitos', leucPetlove(t), `Linfócitos ${N} `),
    plaquetas,
    creatinina: res('CREATININA'),
    ureia: res('URÉIA'),
    alt: res('ALT/TGP'),
    fosfataseAlcalina: res('FOSFATASE ALCALINA'),
  };
}

/** Laudos com layout em colunas que não é parseável (valores lidos manualmente) */
const manual = {
  'Pet com Pet__2026-07-30__Hemograma Completo (Laudo 351588)': {
    hemacias: 2.75,
    hemoglobina: 7.6,
    hematocrito: 24.8,
    leucocitos: 2300,
    neutrofilos: 1932,
    linfocitos: 368,
    plaquetas: 309000,
  },
};

const byDate = new Map();
const files = walk(root).filter((f) => /(hemograma|bioquimico|creatinina)/i.test(path.basename(f)) && f.endsWith('.pdf'));

for (const file of files) {
  const rel = path.relative(root, file);
  const key = rel.replace(/[\\/]/g, '__').replace(/\.pdf$/, '');
  const date = rel.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!date) continue;

  let values;
  if (manual[key]) {
    values = manual[key];
  } else {
    const text = (await pdfText(file)).replace(/\s+/g, ' ');
    if (text.includes('ACR Cunha Hospital')) values = parseAcr(text);
    else if (text.includes('Data Entrada')) values = parsePetlove(text);
    else {
      console.warn('Layout desconhecido:', rel);
      continue;
    }
  }
  const clean = Object.fromEntries(Object.entries(values).filter(([, v]) => v !== undefined));
  const prev = byDate.get(date) ?? {};
  byDate.set(date, { ...clean, ...prev });
  console.log(date, rel, JSON.stringify(clean));
}

const rows = [...byDate.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([date, v]) => ({ date, ...v }));

const header = `// ARQUIVO GERADO por scripts/extract-exams.mjs — não edite manualmente.
import { ExamResult } from './exam.model';

export const EXAM_RESULTS: ExamResult[] = `;
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, header + JSON.stringify(rows, null, 2) + ';\n', 'utf8');
console.log(`\n${rows.length} datas gravadas em ${outFile}`);
