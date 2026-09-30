import type { Country, CountryListItem } from "../types/country";

const LOCAL_API = "/api/countries";


// Feil fra vårt eget API, med statuskode slik at sidene kan vise riktig melding
export class CountryApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function getJson<T>(url: string, customFetch: typeof fetch): Promise<T> {
  const response = await customFetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new CountryApiError(response.status, body?.message || 'Noe gikk galt ved henting av data');
  }
  return response.json();
}


// Henter alle land via vårt lokale API-endepunkt (som snakker med REST Countries på serveren)

export async function fetchAllCountries(customFetch = fetch): Promise<Country[]> {
  const data = await getJson<Country[]>(LOCAL_API, customFetch);
  return Array.isArray(data) ? data : [];
}


//  Henter ett land basert på landkode (cca2 eller cca3)

export async function fetchCountryByCode(code: string, customFetch = fetch): Promise<Country> {
  const codeSafe = encodeURIComponent((code || '').trim());
  return getJson<Country>(`${LOCAL_API}/${codeSafe}`, customFetch);
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
