import type { Country, CountryListItem } from "../types/country";

const LOCAL_API = "/api/countries";


// Henter alle land fra REST Countries API

export async function fetchAllCountries(customFetch = fetch): Promise<Country[]> {
  try {
  // Bruk vårt lokale API-endepunkt som videresender til REST Countries med riktige headere
    const url = `${LOCAL_API}`;
    // Henter data fra URL
    const response = await customFetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Klarte ikke å hente land: ${response.status} ${response.statusText}`);
    }
    const data: Country[] = await response.json();
    return data;
  } catch (error) {
  console.error("Feil ved henting av land:", error);
  throw error;
  }
}


//  Henter ett land basert på landkode (cca2 eller cca3)

export async function fetchCountryByCode(code: string, customFetch = fetch): Promise<Country> {
  try {
  // Bruker lokale API-endepunkt for å hente ett land
    const codeSafe = (code || '').trim();
    const url = `${LOCAL_API}/${codeSafe}`;
    const response = await customFetch(url);
    if (!response.ok) {
      throw new Error(`Klarte ikke å hente landet: ${response.status} ${response.statusText}`);
    }
    const data: unknown = await response.json();
  // Lokalt proxy returnerer et enkelt objekt; håndter array hvis det skulle oppstå
    const item = Array.isArray(data) ? data[0] : data;
    if (!item) {
      throw new Error(`Fant ikke land for kode '${code}'`);
    }
    return item as Country;
  } catch (error) {
  console.error("Feil ved henting av land:", error);
  throw error;
  }
}


// Konverter Country-objekt til forenklet CountryListItem

export function toCountryListItem(country: Country): CountryListItem {
  const name = country?.name?.common || country?.name?.official || country?.cca3 || 'Ukjent';
  const flag = country?.flags?.svg || country?.flags?.png || '';
  return {
    name,
    code: country?.cca3 || country?.cca2 || name,
    flag,
    population: country?.population ?? 0,
  region: country?.region || 'Ukjent',
    capital: country?.capital?.[0],
  };
}


// Filtrer land etter søkeord og region

export function filterCountries(
  countries: CountryListItem[],
  searchTerm: string,
  region: string
): CountryListItem[] {
  let filtered = [...(countries ?? [])];

  // Filtrer etter søkeord (navn eller hovedstad)
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((country) => {
      const name = (country?.name ?? '').toLowerCase();
      const capital = (country?.capital ?? '').toLowerCase();
      return name.includes(term) || capital.includes(term);
    });
  }

  // Filtrer etter region
  if (region && region !== "all") {
    filtered = filtered.filter((country) => (country?.region ?? '') === region);
  }

  return filtered;
}


// Hent unike regioner fra landlisten

export function getUniqueRegions(countries: CountryListItem[]): string[] {
  const regions = new Set((countries ?? []).map((c) => c?.region).filter(Boolean) as string[]);
  return Array.from(regions).sort();
}
