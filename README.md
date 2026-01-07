# LägenhetsByte - Apartment Exchange Platform

En modern plattform för att byta lägenheter med andra i Sverige. Byggd med Next.js 14, TypeScript, Prisma, och PostgreSQL.

## Funktioner

### ✅ Implementerat
- **Användarregistrering och inloggning** - NextAuth.js med credentials provider
- **Lägg upp lägenhet** - Detaljerat formulär med adress, rum, hyra, och bekvämligheter
- **Automatisk geokodning** - Adressen konverteras till koordinater för kartan
- **Sökning med karta** - Interaktiv karta med OpenStreetMap/Leaflet
- **Avancerade filter** - Sök efter stad, antal rum, hyra, balkong, hiss, parkering, m.m.
- **Lägenhetsvyer** - Detaljerad visning av enskilda lägenheter
- **Intressematchningssystem** - Markera intressen, se ömsesidiga matchningar
- **Meddelandesystem** - Chatta med användare vid ömsesidig matchning
- **Responsiv design** - Snyggt UI med Tailwind CSS
- **Snygg landing page** - Informativ startsida

### 🚧 Under utveckling
- Interaktiv planlösningsritare
- Bilduppladdning med rumskoppling
- Stripe-integration för abonnemang

## Teknologi

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Databas**: PostgreSQL med Prisma ORM
- **Karta**: Leaflet med OpenStreetMap
- **UI-komponenter**: Shadcn/ui-inspirerade komponenter
- **Validering**: Zod + React Hook Form

## Kom igång

### Förutsättningar

- Node.js 18+ installerat
- PostgreSQL databas (lokal eller Supabase)
- npm eller yarn

### Installation

1. **Installera dependencies**
```bash
npm install
```

2. **Konfigurera miljövariabler**

Uppdatera `.env`-filen i root-mappen:

```env
# Databas - Använd din PostgreSQL connection string
# För lokal PostgreSQL:
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/apartment_exchange?schema=public"

# För Supabase (gratis tier, rekommenderas):
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# NextAuth - Generera en säker nyckel
NEXTAUTH_SECRET="din-hemliga-nyckel-generera-en-säker"
NEXTAUTH_URL="http://localhost:3000"
```

**Generera en säker NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

3. **Sätt upp databasen**

För **Supabase** (rekommenderas, gratis):
- Gå till [supabase.com](https://supabase.com)
- Skapa ett gratis konto och nytt projekt
- Kopiera connection string från Settings > Database
- Uppdatera `DATABASE_URL` i `.env`

För **lokal PostgreSQL**:
```bash
createdb apartment_exchange
```

4. **Kör Prisma migrations**
```bash
npx prisma generate
npx prisma db push
```

5. **Starta utvecklingsservern**
```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Användning

### Skapa ett konto
1. Gå till startsidan
2. Klicka på "Kom igång" eller "Registrera dig"
3. Fyll i namn, email, och lösenord
4. Logga in med dina uppgifter

### Lägg upp din lägenhet
1. Efter inloggning, gå till "Min lägenhet"
2. Fyll i alla detaljer om din lägenhet:
   - Adress, stad, postnummer
   - Antal rum, hyra, storlek
   - Klicka i bekvämligheter (balkong, hiss, etc.)
   - Skriv en beskrivning
3. Klicka "Spara lägenhet"

### Sök lägenheter
1. Gå till "Sök lägenheter" i menyn
2. Använd filter för att förfina sökningen
3. Växla mellan kart- och listvy
4. Klicka på en lägenhet för att se detaljer

### Markera intresse
1. När du hittat en lägenhet du gillar, klicka på hjärtat
2. Gå till "Mina intressen" för att se:
   - Lägenheter du är intresserad av
   - Vem som visat intresse för din lägenhet
   - Ömsesidiga matchningar (båda markerat intresse)

### Chatta med matchningar
1. Vid ömsesidig matchning kan ni chatta
2. Gå till "Meddelanden" i menyn
3. Välj en konversation och börja chatta
4. Endast användare med ömsesidig matchning kan skicka meddelanden

## Kommande funktioner

- **Planlösningsritare** - Rita och markera rum interaktivt
- **Bilduppladdning** - Ladda upp och koppla bilder till rum
- **Betalning** - Stripe-abonnemang för tillgång till plattformen

## Deployment

Projektet är optimerat för deployment på Vercel med Supabase som databas (båda har generösa gratis tiers).
