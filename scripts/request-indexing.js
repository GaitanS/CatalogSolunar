/**
 * Google Indexing API - Request Indexing Script
 *
 * Generează automat TOATE URL-urile din sitemap (specii, orașe, blog, locuri de pescuit).
 *
 * UTILIZARE:
 *   node scripts/request-indexing.js              # toate URL-urile
 *   node scripts/request-indexing.js --url URL    # un singur URL
 */

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// ============ CONFIGURARE ============

const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');
const BASE_URL = 'https://calendarsolunar.ro';

// ============ EXTRAGERE URL-URI DIN SURSE ============

function extractSlugs(filePath, pattern) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(pattern);
  if (!matches) return [];
  return matches.map(m => {
    const match = m.match(/['"]([^'"]+)['"]/);
    return match ? match[1] : null;
  }).filter(Boolean);
}

function getAllUrls() {
  const urls = [];

  // Pagini statice
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

  // Landing-uri SEO (lunare + anuale) — lipseau anterior
  const landingFile = path.join(__dirname, '..', 'src', 'data', 'seoLandingPages.ts');
  const landingSlugs = extractSlugs(landingFile, /slug:\s*['"][^'"]+['"]/g);
  landingSlugs.filter(s => s !== 'string').forEach(slug => {
    urls.push(`${BASE_URL}/${slug}`);
  });

  // Specii
  const speciesFile = path.join(__dirname, '..', 'src', 'data', 'species.ts');
  const speciesSlugs = extractSlugs(speciesFile, /slug:\s*['"][^'"]+['"]/g);
  // Filter out the interface line "slug: string"
  speciesSlugs.filter(s => s !== 'string').forEach(slug => {
    urls.push(`${BASE_URL}/${slug}`);
  });

  // Orașe
  const citiesFile = path.join(__dirname, '..', 'src', 'data', 'cities.ts');
  const citySlugs = extractSlugs(citiesFile, /slug:\s*['"][^'"]+['"]/g);
  citySlugs.filter(s => s !== 'string').forEach(slug => {
    urls.push(`${BASE_URL}/${slug}`);
  });

  // Articole blog
  const blogFile = path.join(__dirname, '..', 'src', 'data', 'blogArticles.ts');
  const blogSlugs = extractSlugs(blogFile, /slug:\s*['"][^'"]+['"]/g);
  blogSlugs.filter(s => s !== 'string').forEach(slug => {
    urls.push(`${BASE_URL}/blog/${slug}`);
  });

  // Locuri de pescuit
  const locationsFile = path.join(__dirname, '..', 'src', 'data', 'fishingLocations.ts');
  const locationSlugs = extractSlugs(locationsFile, /slug:\s*['"][^'"]+['"]/g);
  locationSlugs.filter(s => s !== 'string').forEach(slug => {
    urls.push(`${BASE_URL}/locuri-pescuit/${slug}`);
  });

  // Pagini judet — derivate din valorile county:
  const locContent = fs.readFileSync(locationsFile, 'utf-8');
  const countyToSlug = (county) =>
    county.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/ş|ș/g, 's').replace(/ţ|ț/g, 't').replace(/ă|â/g, 'a').replace(/î/g, 'i')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const counties = new Set((locContent.match(/county:\s*['"][^'"]+['"]/g) || []).map(m => m.match(/['"]([^'"]+)['"]/)[1]));
  counties.forEach(c => urls.push(`${BASE_URL}/locuri-pescuit/judet/${countyToSlug(c)}`));

  return [...new Set(urls)]; // deduplicate
}

// ============ SCRIPT ============

async function main() {
  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    console.error('\n❌ Fișierul service-account.json nu a fost găsit!');
    console.error(`   Calea așteptată: ${SERVICE_ACCOUNT_FILE}\n`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const indexing = google.indexing({ version: 'v3', auth: client });

  // Determină URL-urile
  const args = process.argv.slice(2);
  let urls;

  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url');
    const singleUrl = args[urlIndex + 1];
    if (!singleUrl) {
      console.error('❌ Specifică un URL după --url');
      process.exit(1);
    }
    urls = [singleUrl];
  } else {
    urls = getAllUrls();
  }

  console.log(`\n🚀 Trimit ${urls.length} cereri de indexare...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const progress = `[${i + 1}/${urls.length}]`;

    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`✅ ${progress} ${url}`);
      success++;
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.message;
      console.error(`❌ ${progress} ${url} — ${msg}`);
      failed++;
    }

    // Pauză între cereri (evită rate limiting)
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n📊 Rezultat: ${success} reușite, ${failed} eșuate din ${urls.length} total`);
  console.log('⏰ Google va procesa cererile în 1-3 zile.\n');
}

main().catch(err => {
  console.error('Eroare fatală:', err.message);
  process.exit(1);
});
