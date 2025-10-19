# Landutforsker

En applikasjon i SvelteKit som henter og viser landdata fra REST Countries API.

## Hvordan kjøre prosjektet

### Krav
- Node.js 18 eller nyere
- npm

### Oppstart

1. Installer avhengigheter:
   ```bash
   npm install
   ```

2. Start utviklingsserver:
   ```bash
   npm run dev
   ```

3. Åpne nettleseren på `http://localhost:5173`


## Hva som er implementert

**1. Liste over alle land**  
Viser alle land fra API-et med navn, flagg, befolkning, region og hovedstad. Data hentes via et lokalt API-endepunkt som videresender til REST Countries.

**2. Paginering**  
Fungerende paginering hvor man kan velge antall resultater per side (5, 10, 25, 50). Har navigeringsknapper for forrige/neste side samt hurtigknapper til første/siste side. Pagineringen er laget programmatisk basert på totalt antall resultater.

**3. Detaljside for hvert land**  
Når man klikker på et land kommer man til en detaljside med mer informasjon som valuta, språk, tidssoner, naboland, areal, og lenker til kart.

**4. Søk og filtrering**  
Man kan søke etter land basert på navn eller hovedstad, og filtrere på region. Resultater oppdateres dynamisk.

## Hva som er gjort ekstra

### Design og brukeropplevelse
- Responsivt design for mobil og desktop

### Ekstra funksjonalitet
- Viser landskoder (cca2/cca3)
- Status-merking (selvstendig/avhengig, landlocked)
- Lenker til naboland for navigasjon
- Lenker til Google Maps og OpenStreetMap
- Loading spinner
- Feilhåndtering

## Prosjektstruktur

```
src/
  lib/
    api/
      countries.ts           # API-funksjoner (fetch, filter, mapping)
    types/
      country.ts             # TypeScript-typer
  routes/
    +layout.svelte           # Layout med header/footer
    +page.ts                 # Data loading for forsiden
    +page.svelte             # Landlisteside med søk/filter/paginering
    api/
      countries/
        +server.ts           # Endpoint for alle land
        [code]/
          +server.ts         # Endpoint for ett land
    country/
      [code]/
        +page.ts             # Data loading for detaljside
        +page.svelte         # Detaljside
```
