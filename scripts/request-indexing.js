/**
 * Google Indexing API - Request Indexing Script
 *
 * ⚠️  ATENȚIE: Google Indexing API funcționează DOAR pentru pagini cu structured data
 *    de tip JobPosting sau BroadcastEvent (embedded în VideoObject).
 *    Pentru site-uri generale (ca acest calendar de pescuit), API-ul acceptă cererile
 *    dar le IGNORĂ complet. NU va duce la indexare!
 *
 *    Sursa oficială: https://developers.google.com/search/apis/indexing-api/v3/quickstart
 *
 * CE SĂ FACI ÎN SCHIMB pentru a obține indexare:
 *    1. Google Search Console → URL Inspection → introdu URL-ul → "Request Indexing"
 *       (limită: ~10 URL-uri/zi, manual)
 *    2. Asigură-te că sitemap.xml e submis în GSC
 *    3. Obține backlink-uri de pe alte site-uri (cel mai important factor!)
 *    4. Creează profile pe forumuri/directoare de pescuit cu link către site
 *    5. Distribuie articolele pe social media (Facebook, Reddit, forumuri pescuit)
 *
 * UTILIZARE (pentru referință - va trimite cereri dar Google le va ignora):
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
  'https://calendarsolunar.ro/azi',

  // Pagini specii
  'https://calendarsolunar.ro/pescuit-crap',
  'https://calendarsolunar.ro/pescuit-salau',
  'https://calendarsolunar.ro/pescuit-pastrav',
  'https://calendarsolunar.ro/pescuit-somn',
  'https://calendarsolunar.ro/pescuit-stiuca',
  'https://calendarsolunar.ro/pescuit-caras',

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

  // Articole blog - ghiduri specii
  'https://calendarsolunar.ro/blog/ghid-pescuit-crap',
  'https://calendarsolunar.ro/blog/ghid-pescuit-salau',
  'https://calendarsolunar.ro/blog/ghid-pescuit-somn',
  'https://calendarsolunar.ro/blog/ghid-pescuit-stiuca',
  'https://calendarsolunar.ro/blog/ghid-pescuit-caras',
  'https://calendarsolunar.ro/blog/ghid-pescuit-lin',
  'https://calendarsolunar.ro/blog/ghid-pescuit-pastrav',

  // Articole blog - tehnici și echipament
  'https://calendarsolunar.ro/blog/ce-este-calendarul-solunar',
  'https://calendarsolunar.ro/blog/cele-mai-bune-ore-pescuit-2026',
  'https://calendarsolunar.ro/blog/cum-alegi-lanseta-pescuit',
  'https://calendarsolunar.ro/blog/cum-alegi-mulineta-pescuit',
  'https://calendarsolunar.ro/blog/cum-sa-prinzi-primul-peste',
  'https://calendarsolunar.ro/blog/de-ce-nu-musca-pestii',
  'https://calendarsolunar.ro/blog/echipament-pescuit-incepatori',
  'https://calendarsolunar.ro/blog/ghid-complet-boilies',
  'https://calendarsolunar.ro/blog/ghid-nadire-crap',
  'https://calendarsolunar.ro/blog/greseli-incepatori-pescuit',
  'https://calendarsolunar.ro/blog/noduri-pescuit-esentiale',
  'https://calendarsolunar.ro/blog/pescuit-cu-pluta-ghid-complet',
  'https://calendarsolunar.ro/blog/pescuit-cu-porumb-ghid',
  'https://calendarsolunar.ro/blog/pescuit-cu-viermi-ghid',
  'https://calendarsolunar.ro/blog/pescuit-din-barca-ghid',
  'https://calendarsolunar.ro/blog/pescuit-in-curent-tehnici',

  // Articole blog - locații
  'https://calendarsolunar.ro/blog/pescuit-constanta-litoral-ghid',
  'https://calendarsolunar.ro/blog/pescuit-delta-dunarii-ghid',
  'https://calendarsolunar.ro/blog/pescuit-dunare-ghid-complet',
  'https://calendarsolunar.ro/blog/pescuit-langa-bucuresti',
  'https://calendarsolunar.ro/blog/pescuit-marea-neagra-ghid',
  'https://calendarsolunar.ro/blog/top-10-lacuri-pescuit-romania',

  // Articole blog - sezoane
  'https://calendarsolunar.ro/blog/pescuit-iarna-sfaturi',
  'https://calendarsolunar.ro/blog/pescuit-primavara-ghid-complet',
  'https://calendarsolunar.ro/blog/pescuit-vara-ghid-complet',
  'https://calendarsolunar.ro/blog/pescuit-toamna-ghid-complet',
  'https://calendarsolunar.ro/blog/pescuit-nocturn-ghid-complet',
  'https://calendarsolunar.ro/blog/pescuit-weekend-ghid-rapid',

  // Articole blog - diverse
  'https://calendarsolunar.ro/blog/influenta-lunii-asupra-pescuitului',
  'https://calendarsolunar.ro/blog/intrebari-frecvente-calendar-solunar',
  'https://calendarsolunar.ro/blog/permise-pescuit-romania-2026',
  'https://calendarsolunar.ro/blog/pescuit-competitiv-romania',
  'https://calendarsolunar.ro/blog/pescuit-crap-pe-sesiuni-48h',
  'https://calendarsolunar.ro/blog/pescuit-cu-copiii-ghid-familie',
  'https://calendarsolunar.ro/blog/presiunea-atmosferica-pescuit',
  'https://calendarsolunar.ro/blog/siguranta-la-pescuit-ghid',
  'https://calendarsolunar.ro/blog/fotografie-pescuit-ghid',
  'https://calendarsolunar.ro/blog/vremea-si-pescuitul-ghid-complet',

  // Articole blog - calendar solunar lunar
  'https://calendarsolunar.ro/blog/solunar-februarie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-martie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-aprilie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-mai-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-iunie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-iulie-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-august-2026-ghid',
  'https://calendarsolunar.ro/blog/solunar-octombrie-2026-ghid',
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

  console.log('\n⚠️  ATENȚIE: Google Indexing API funcționează DOAR pentru JobPosting/BroadcastEvent.');
  console.log('   Pentru site-uri generale, aceste cereri vor fi IGNORATE de Google.');
  console.log('   Folosește GSC URL Inspection Tool manual pentru a solicita indexare.\n');
  console.log(`🚀 Trimit ${urls.length} cereri (dar Google le va ignora pentru site-uri non-job)...\n`);

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
