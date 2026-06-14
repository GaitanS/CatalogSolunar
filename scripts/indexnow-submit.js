/**
 * IndexNow submit script (Bing / Yandex / Seznam instant indexing).
 *
 * Submits every public URL to the IndexNow API so Bing & co. recrawl quickly.
 * Run after each deploy:
 *   node scripts/indexnow-submit.js
 *
 * The key file public/<KEY>.txt must be reachable at
 *   https://calendarsolunar.ro/<KEY>.txt
 */

const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://calendarsolunar.ro';
const HOST = 'calendarsolunar.ro';
const KEY = 'ce49f848737432c66805e1b280e695a4';
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

function extractSlugs(filePath, pattern) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(pattern);
  if (!matches) return [];
  return matches
    .map((m) => {
      const match = m.match(/['"]([^'"]+)['"]/);
      return match ? match[1] : null;
    })
    .filter(Boolean)
    .filter((s) => s !== 'string');
}

function getAllUrls() {
  const urls = [];
  const d = (p) => path.join(__dirname, '..', 'src', 'data', p);

  // Static / hub pages
  urls.push(
    `${BASE_URL}/`,
    `${BASE_URL}/azi`,
    `${BASE_URL}/lunar`,
    `${BASE_URL}/rasarit-apus-soare`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/locuri-pescuit`,
    `${BASE_URL}/despre`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/confidentialitate`,
    `${BASE_URL}/termeni`,
    `${BASE_URL}/cookies`,
  );

  // Species + cities (top-level slugs)
  extractSlugs(d('species.ts'), /slug:\s*['"][^'"]+['"]/g).forEach((s) => urls.push(`${BASE_URL}/${s}`));
  extractSlugs(d('cities.ts'), /slug:\s*['"][^'"]+['"]/g).forEach((s) => urls.push(`${BASE_URL}/${s}`));

  // SEO landing pages (monthly + annual) — these were missing before
  extractSlugs(d('seoLandingPages.ts'), /slug:\s*['"][^'"]+['"]/g).forEach((s) => urls.push(`${BASE_URL}/${s}`));

  // Blog articles
  extractSlugs(d('blogArticles.ts'), /slug:\s*['"][^'"]+['"]/g).forEach((s) => urls.push(`${BASE_URL}/blog/${s}`));

  // Fishing locations
  const locFile = fs.readFileSync(d('fishingLocations.ts'), 'utf-8');
  extractSlugs(d('fishingLocations.ts'), /slug:\s*['"][^'"]+['"]/g).forEach((s) => urls.push(`${BASE_URL}/locuri-pescuit/${s}`));

  // County index pages — derive slugs from distinct county: values (mirrors countyToSlug).
  const countyToSlug = (county) =>
    county
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/ş|ș/g, 's')
      .replace(/ţ|ț/g, 't')
      .replace(/ă|â/g, 'a')
      .replace(/î/g, 'i')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  const counties = new Set(
    (locFile.match(/county:\s*['"][^'"]+['"]/g) || []).map((m) => m.match(/['"]([^'"]+)['"]/)[1])
  );
  counties.forEach((c) => urls.push(`${BASE_URL}/locuri-pescuit/judet/${countyToSlug(c)}`));

  return [...new Set(urls)];
}

async function main() {
  const urlList = getAllUrls();
  console.log(`\n🚀 IndexNow: trimit ${urlList.length} URL-uri către Bing/Yandex...\n`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // IndexNow returns 200 or 202 on success.
  if (res.status === 200 || res.status === 202) {
    console.log(`✅ Acceptat (HTTP ${res.status}). ${urlList.length} URL-uri trimise.\n`);
  } else {
    const text = await res.text().catch(() => '');
    console.error(`❌ IndexNow a răspuns HTTP ${res.status}. ${text}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Eroare fatală IndexNow:', err.message);
  process.exit(1);
});
