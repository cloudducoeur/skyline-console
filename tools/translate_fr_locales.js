const fs = require('fs');
const path = require('path');

const enPath = path.resolve('src/locales/en.json');
const frPath = path.resolve('src/locales/fr.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function flatten(obj, prefix = '', out = {}) {
  if (typeof obj === 'string') {
    out[prefix] = obj;
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
    return out;
  }
  if (isObject(obj)) {
    for (const k of Object.keys(obj)) {
      flatten(obj[k], prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

function setByPath(obj, pathExpr, value) {
  const re = /([^.[\]]+)|\[(\d+)\]/g;
  const parts = [];
  let m;
  while ((m = re.exec(pathExpr))) {
    parts.push(m[1] !== undefined ? m[1] : Number(m[2]));
  }
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] == null) {
      cur[p] = typeof parts[i + 1] === 'number' ? [] : {};
    }
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

const TOKEN_REPLACERS = [
  { re: /\{[^{}]+\}/g, prefix: '__VAR_' },
  { re: /<[^>]+>/g, prefix: '__TAG_' },
  { re: /%\{[^}]+\}/g, prefix: '__PCT_' },
  { re: /\b[a-zA-Z_]+\.[a-zA-Z0-9_\.]+\b/g, prefix: '__DOT_' },
];

function protect(text) {
  let s = text;
  const tokens = [];
  let idx = 0;
  for (const { re, prefix } of TOKEN_REPLACERS) {
    s = s.replace(re, (m) => {
      const token = `${prefix}${idx++}__`;
      tokens.push([token, m]);
      return token;
    });
  }
  return { s, tokens };
}

function unprotect(text, tokens) {
  let s = text;
  for (const [token, val] of tokens) {
    s = s.split(token).join(val);
  }
  return s;
}

async function translateOne(text) {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: 'fr',
    dt: 't',
    q: text,
  });
  const url = `https://translate.googleapis.com/translate_a/single?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json,text/plain,*/*',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  const segments = Array.isArray(data?.[0]) ? data[0] : [];
  const translated = segments.map((x) => x[0]).join('');
  if (!translated) {
    throw new Error('Empty translation response');
  }
  return translated;
}

function saveFr() {
  fs.writeFileSync(frPath, JSON.stringify(fr, null, 2) + '\n');
}

(async () => {
  const enFlat = flatten(en);
  const frFlat = flatten(fr);

  const candidates = [];
  for (const [key, enVal] of Object.entries(enFlat)) {
    const frVal = frFlat[key];
    if (typeof enVal !== 'string' || typeof frVal !== 'string') continue;
    if (frVal !== enVal) continue; // already translated/customized
    if (!enVal.trim()) continue;
    candidates.push({ key, text: enVal });
  }

  console.log(`Candidates: ${candidates.length}`);

  let translated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < candidates.length; i++) {
    const item = candidates[i];

    if (item.text.length > 2500) {
      skipped++;
      continue;
    }

    const { s, tokens } = protect(item.text);

    let out = null;
    try {
      out = await translateOne(s);
    } catch {
      // retry once
      try {
        out = await translateOne(s);
      } catch {
        failed++;
      }
    }

    if (out) {
      setByPath(fr, item.key, unprotect(out, tokens));
      translated++;
    }

    if ((i + 1) % 100 === 0) {
      saveFr();
      console.log(`Progress: ${i + 1}/${candidates.length} | translated=${translated} | failed=${failed} | skipped=${skipped}`);
    }
  }

  saveFr();
  console.log(`Done. translated=${translated}, failed=${failed}, skipped=${skipped}`);
})();
