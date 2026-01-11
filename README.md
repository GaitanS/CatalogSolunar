# 🌑 Calendar Solunar - Pescuit & Activitate Lunară

O aplicație web modernă, autonomă, dedicată pasionaților de pescuit. Aplicația calculează științific perioadele solunare optime, fazele lunii și oferă o prognoză detaliată de pescuit bazată pe algoritmi astronomici de precizie.

**Live Demo:** [calendarsolunar.ro](https://calendarsolunar.ro)

## ✨ Caracteristici Principale

*   **Algoritm Solunar Avansat:** Identifică automat perioadele **Majore** (tranzit lunar zenit/nadir) și **Minore** (răsărit/apus de lună) pentru orice locație și dată.
*   **Model Astronomic Real-Time:** Folosește librăria `suncalc` pentru a calcula poziția exactă a astrelor fără a depinde de baze de date externe.
*   **Vizualizare 3D:** Randare interactivă a lunii pentru a ilustra iluminarea curentă.
*   **Bazat pe Specii:** Recomandări specifice pentru speciile de pești din România (Știucă, Șalău, Crap, etc.) în funcție de sezon și faza lunii.
*   **Vreme Integrată:** Prognoză meteo locală și condiții de vânt via API extern.
*   **Autonomie Totală:** Sistem "Set & Forget". Nu necesită curățare cache sau actualizare manuală a datelor calendaristice.
*   **Monetizare:** Integrare completă și verificată cu Google AdSense.

## 🛠️ Arhitectură Tehnică

Proiectul este construit pe stack-ul **Next.js** (App Router), optimizat pentru viteză (Lighthouse score 90+) și indexare SEO.

### Stack Tehnologic

| Componentă | Tehnologie | Rol |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 | Randare Server-Side (SSR) și Statică (SSG) |
| **Limbaj** | TypeScript | Siguranță a datelor și tipizare strictă |
| **CSS** | Tailwind CSS | Design responsive și modern (Glassmorphism) |
| **Calcul** | SunCalc | Matematică astronomică |
| **Server** | Node.js (Standalone) | Rulare eficientă pe VPS |
| **Process Mgr** | PM2 | Mentenanță proces și auto-restart |
| **Reverse Proxy** | Nginx | Securitate, SSL și compresie gzip |

### Structura Proiectului

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx         # Dashboard Principal (Azi)
│   ├── lunar/           # Calendar detaliat (Lunar/Săptămânal)
│   ├── blog/            # Sistem de blog optimizat SEO
│   └── layout.tsx       # Metaetichete globale & setup AdSense
├── components/          # Componente UI Modulare
│   ├── Moon3D.tsx       # Canvas 3D pentru randare Lună
│   ├── Constellation... # Fundal animat (Client-side optimizat)
│   ├── SolunarChart.tsx # Grafice de activitate
│   ├── AdUnit.tsx       # Componentă izolată pentru reclame
│   └── ...
├── lib/                 # Logica de Business (Core)
│   ├── solunar.ts       # ALGORITMUL PRINCIPAL (Vezi mai jos)
│   ├── weather.ts       # Integrator API Vreme
│   └── advice.ts        # Generatorul de sfaturi de pescuit
└── public/              # Asset-uri statice (robots.txt, ads.txt)
```

## 🧠 Inima Aplicației: `solunar.ts`

Fișierul `src/lib/solunar.ts` conține inteligenta aplicației. Funcționarea este pur matematică:

1.  **Astronomical Calculation:**
    *   Preia coordonatele (Lat/Lon) și data curentă.
    *   Calculează unghiul orar al lunii folosind `suncalc`.
2.  **Transit Detection:**
    *   Iterează ziua pentru a găsi punctele de maximă altitudine (Upper Transit) și minimă (Lower Transit).
    *   Aceste puncte devin centrele **Perioadelor Majore** (+/- 1 oră).
3.  **Efficiency Scoring:**
    *   Calculează un "Rating General" (1-5 Pești).
    *   Aplică bonusuri pentru Lună Nouă/Plină (gravitație maximă) și suprapuneri cu Răsărit/Apus Soare.

## 🚀 Instalare și Dezvoltare

1.  **Clonează proiectul:**
    ```bash
    git clone https://github.com/GaitanS/CatalogSolunar.git
    ```

2.  **Instalează dependențele:**
    ```bash
    npm install
    ```

3.  **Configurează variabila de mediu (opțional pentru vreme):**
    Crează un fișier `.env.local`:
    ```env
    NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
    ```

4.  **Pornește serverul local:**
    ```bash
    npm run dev
    ```
    Accesează `http://localhost:3000`.

## 🌐 Deployment pe VPS

Aplicația este configurată pentru **Standalone Output** (build mic, doar fișierele necesare).

1.  **Build:**
    ```bash
    npm run build
    ```
    *Aceasta va crea folderul `.next/standalone`.*

2.  **Pregătire Asset-uri (Critic):**
    Next.js Standalone nu include default fișierele publice sau statice. Trebuie copiate manual pe server:
    ```bash
    cp -r public .next/standalone/public
    cp -r .next/static .next/standalone/.next/static
    ```

3.  **Rulare cu PM2:**
    ```bash
    pm2 start ecosystem.config.js
    ```

## 💰 Configurare AdSense

*   **Identificare:** Site-ul folosește `google-adsense-account` meta tag și `ads.txt` pentru verificare.
*   **Plasare:** Reclamele "Auto Ads" sunt injectate în `layout.tsx`. Unitățile manuale pot fi plasate folosind `<AdUnit slotId="..." />`.

---
© 2026 Calendar Solunar. Toate drepturile rezervate.
