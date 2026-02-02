/**
 * Google Indexing API - Request Indexing Script
 *
 * Trimite notificări către Google pentru a solicita indexarea/re-crawlarea URL-urilor.
 *
 * SETUP (o singură dată):
 * 1. Mergi la https://console.cloud.google.com/
 * 2. Creează un proiect nou (sau folosește unul existent)
 * 3. Activează "Web Search Indexing API" (Indexing API):
 *    https://console.cloud.google.com/apis/library/indexing.googleapis.com
 * 4. Mergi la "IAM & Admin" → "Service Accounts" → "Create Service Account"
 *    - Nume: "indexing-bot" (sau ce vrei tu)
 *    - Click "Create and Continue" → "Done"
 * 5. Click pe service account-ul creat → "Keys" → "Add Key" → "Create new key" → JSON
 *    - Salvează fișierul JSON descărcat ca: scripts/service-account.json
 * 6. Copiază email-ul service account-ului (ex: indexing-bot@proiect.iam.gserviceaccount.com)
 * 7. În Google Search Console → Setări → Utilizatori și permisiuni → Adaugă utilizator
 *    - Lipește email-ul service account-ului
 *    - Setează permisiunea: "Proprietar"
 *
 * UTILIZARE:
 *   node scripts/request-indexing.js
 *   node scripts/request-indexing.js --url https://calendarsolunar.ro/blog/un-articol
 */

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// ============ CONFIGURARE ============

const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

const IMPORTANT_URLS = [
  // Pagini principale
  'https://calendarsolunar.ro/',
  'https://calendarsolunar.ro/blog',
  'https://calendarsolunar.ro/lunar',
  'https://calendarsolunar.ro/despre',
  'https://calendarsolunar.ro/contact',
  'https://calendarsolunar.ro/confidentialitate',
  'https://calendarsolunar.ro/termeni',
  'https://calendarsolunar.ro/cookies',

  // Pagini noi - Solunar Azi
  'https://calendarsolunar.ro/azi',

  // Pagini orașe
  'https://calendarsolunar.ro/bucuresti',
  'https://calendarsolunar.ro/cluj-napoca',
  'https://calendarsolunar.ro/timisoara',
  'https://calendarsolunar.ro/iasi',
  'https://calendarsolunar.ro/constanta',
  'https://calendarsolunar.ro/brasov',
  'https://calendarsolunar.ro/galati',
  'https://calendarsolunar.ro/craiova',
  'https://calendarsolunar.ro/oradea',
  'https://calendarsolunar.ro/sibiu',
  'https://calendarsolunar.ro/targu-mures',
  'https://calendarsolunar.ro/bacau',

  // Articole blog
  'https://calendarsolunar.ro/blog/ghid-pescuit-pastrav',
  'https://calendarsolunar.ro/blog/pescuit-marea-neagra-ghid',
  'https://calendarsolunar.ro/blog/permise-pescuit-romania-2026',
  'https://calendarsolunar.ro/blog/pescuit-crap-pe-sesiuni-48h',
  'https://calendarsolunar.ro/blog/pescuit-cu-viermi-ghid',
  'https://calendarsolunar.ro/blog/pescuit-cu-porumb-ghid',
  'https://calendarsolunar.ro/blog/pescuit-competitiv-romania',
  'https://calendarsolunar.ro/blog/pescuit-cu-copiii-ghid-familie',
  'https://calendarsolunar.ro/blog/solunar-iunie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-octombrie-2026-ghid',
  'https://calendarsolunar.ro/blog/siguranta-la-pescuit-ghid',
  'https://calendarsolunar.ro/blog/fotografie-pescuit-ghid',
  'https://calendarsolunar.ro/blog/pescuit-constanta-litoral-ghid',

  // Articole lunare noi
  'https://calendarsolunar.ro/blog/solunar-februarie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-martie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-aprilie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-iulie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-august-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-noiembrie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-decembrie-2026-ghid',
];

// ============ SCRIPT ============

async function main() {
  // Verifică dacă fișierul service account există
  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    console.error('\n❌ Fișierul service-account.json nu a fost găsit!');
    console.error(`   Calea așteptată: ${SERVICE_ACCOUNT_FILE}`);
    console.error('\n📋 Urmează pașii de setup din comentariul de la începutul scriptului.');
    console.error('   Pe scurt:');
    console.error('   1. Creează un proiect în Google Cloud Console');
    console.error('   2. Activează "Web Search Indexing API"');
    console.error('   3. Creează un Service Account și descarcă cheia JSON');
    console.error('   4. Salvează cheia ca: scripts/service-account.json');
    console.error('   5. Adaugă email-ul service account ca Owner în Search Console\n');
    process.exit(1);
  }

  // Autentificare
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const indexing = google.indexing({ version: 'v3', auth: client });

  // Determină URL-urile de trimis
  const args = process.argv.slice(2);
  let urls = IMPORTANT_URLS;

  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url');
    const singleUrl = args[urlIndex + 1];
    if (!singleUrl) {
      console.error('❌ Specifică un URL după --url');
      process.exit(1);
    }
    urls = [singleUrl];
  }

  if (args.includes('--all-blog')) {
    // Citește toate articolele din blogArticles.ts
    try {
      const blogFile = fs.readFileSync(
        path.join(__dirname, '..', 'src', 'data', 'blogArticles.ts'),
        'utf-8'
      );
      const slugMatches = blogFile.match(/slug:\s*['"]([^'"]+)['"]/g);
      if (slugMatches) {
        const blogUrls = slugMatches.map(match => {
          const slug = match.match(/['"]([^'"]+)['"]/)[1];
          return `https://calendarsolunar.ro/blog/${slug}`;
        });
        urls = [...new Set([...IMPORTANT_URLS, ...blogUrls])];
      }
    } catch (e) {
      console.error('❌ Nu am putut citi blogArticles.ts:', e.message);
    }
  }

  console.log(`\n🚀 Solicit indexarea pentru ${urls.length} URL-uri...\n`);

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
