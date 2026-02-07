# Calendar Solunar - calendarsolunar.ro

Calendar de pescuit solunar pentru Romania cu ore exacte, faze lunare si prognoza meteo pe 14 zile. 100% gratuit.

**Live:** [calendarsolunar.ro](https://calendarsolunar.ro)

## Features

- **Calendar Solunar** — perioade majore si minore de activitate calculate pe baza pozitiei Lunii si Soarelui (SunCalc)
- **Prognoza 14 zile** — activitate solunara combinata cu date meteo (temperatura, vant, presiune)
- **Vizualizare 3D Luna** — randare interactiva cu Three.js
- **12 orase** — date personalizate pentru Bucuresti, Cluj-Napoca, Timisoara, Iasi, Constanta, Brasov, Galati, Craiova, Oradea, Sibiu, Targu-Mures, Bacau
- **6 specii de pesti** — ghiduri dedicate pentru crap, salau, pastrav, somn, stiuca, caras
- **49+ articole blog** — ghiduri de pescuit, tehnici, echipament, locatii
- **SEO complet** — Schema.org (FAQ, Article, Organization, BreadcrumbList), Open Graph, sitemap dinamic, canonical URLs
- **Mobile-first** — design responsive cu Tailwind CSS
- **Google AdSense** — integrare reclame cu unitati manuale si auto ads

## Tech Stack

| Componenta | Tehnologie |
|:---|:---|
| Framework | Next.js 15.1.6 (App Router, SSG/SSR) |
| Limbaj | TypeScript |
| UI | React 18, Tailwind CSS |
| 3D | Three.js |
| Calcule astronomice | SunCalc |
| Deployment | Standalone → PM2 → Nginx |

## Quick Start

```bash
git clone https://github.com/GaitanS/CatalogSolunar.git
cd CatalogSolunar
npm install
npm run dev
```

Aplicatia ruleaza pe [http://localhost:3500](http://localhost:3500).

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Homepage (calendar solunar)
│   ├── azi/              # Solunar azi
│   ├── lunar/            # Calendar faze lunare
│   ├── blog/             # Articole blog
│   │   └── [slug]/       # Articol individual
│   ├── [slug]/           # Pagini dinamice (orase & specii)
│   ├── contact/          # Pagina contact
│   ├── despre/           # Pagina despre
│   ├── robots.ts         # Robots.txt (dinamic)
│   ├── sitemap.ts        # Sitemap XML (dinamic)
│   └── layout.tsx        # Root layout, metadata, AdSense
├── components/           # Componente React
│   ├── Moon3D.tsx        # Vizualizare 3D Luna (Three.js)
│   ├── SolunarChart.tsx  # Grafic activitate solunara
│   ├── WeatherForecast.tsx
│   ├── AdUnit.tsx        # Google AdSense component
│   ├── SchemaMarkup.tsx  # JSON-LD structured data
│   └── ...
├── data/                 # Date statice
│   ├── blogArticles.ts   # Continut blog (49+ articole)
│   ├── cities.ts         # Coordonate orase
│   └── species.ts        # Informatii specii pesti
├── lib/                  # Logica de business
│   ├── solunar.ts        # Algoritm solunar principal
│   ├── weather.ts        # Weather API integration
│   └── advice.ts         # Generator sfaturi pescuit
└── middleware.ts          # Redirecturi www→non-www, http→https

nginx/                     # Configurare Nginx reverse proxy
scripts/                   # Google Indexing API script
ecosystem.config.js        # PM2 process manager config
```

## Deployment (Hostinger VPS)

### 1. Clone & Build

```bash
cd /var/www/solunar
git pull
npm install
npm run build
```

### 2. Nginx

```bash
sudo cp nginx/calendarsolunar.ro.conf /etc/nginx/sites-available/calendarsolunar.ro
sudo ln -sf /etc/nginx/sites-available/calendarsolunar.ro /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. PM2

```bash
pm2 start ecosystem.config.js
pm2 save
```

### SSL

Certificate Let's Encrypt (Certbot) la `/etc/letsencrypt/live/calendarsolunar.ro/`.

## Google Indexing API

Trimite cereri de indexare pentru toate paginile:

```bash
node scripts/request-indexing.js --all-blog
```

Necesita `scripts/service-account.json` (nu e in repo). Vezi comentariile din script pentru setup.

## Algoritm Solunar

Fisierul `src/lib/solunar.ts` contine logica principala:

1. **Calcul astronomic** — pozitia exacta a Lunii si Soarelui pe baza coordonatelor GPS
2. **Detectie tranzit** — identifica Upper Transit (zenit) si Lower Transit (nadir) ca centre ale perioadelor majore
3. **Rating activitate** — scor 1-5 bazat pe faza lunara, suprapuneri cu rasarit/apus soare si conditii meteo

## License

All rights reserved. © 2026 Calendar Solunar.
