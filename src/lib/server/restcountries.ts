// Klient for REST Countries v5. Kjører bare på serveren, slik at API-nøkkelen aldri sendes til nettleseren.
// v3.1 ble lagt ned i 2026, så svarene fra v5 gjøres om til den samme Country-typen som resten av appen bruker.
import { env } from '$env/dynamic/private';
import type { Country } from '$lib/types/country';

const BASE_URL = 'https://api.restcountries.com/countries/v5';
const PAGE_SIZE = 100; // maks antall per side på gratisplanen
const MAX_PAGES = 10;
const CACHE_MS = 10 * 60 * 1000;

const LIST_FIELDS = [
	'names.common',
	'names.official',
	'codes.alpha_2',
	'codes.alpha_3',
	'flag.url_png',
	'flag.url_svg',
	'flag.description',
	'population',
	'region',
	'capitals'
].join(',');

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}

// Bare feltene fra v5 som appen bruker
interface V5Country {
	names?: {
		common?: string;
		official?: string;
		native?: Record<string, { common: string; official: string }>;
	};
	codes?: { alpha_2?: string; alpha_3?: string };
	capitals?: { name?: string }[];
	region?: string;
	subregion?: string;
	population?: number;
	area?: { kilometers?: number };
	flag?: { url_png?: string; url_svg?: string; description?: string };
	currencies?: { code?: string; name?: string; symbol?: string }[];
	languages?: { iso639_3?: string; name?: string }[];
	borders?: string[];
	timezones?: string[];
	continents?: string[];
	links?: { google_maps?: string; open_street_maps?: string };
	landlocked?: boolean;
	classification?: { sovereign?: boolean };
}

interface V5Response {
	data?: { objects?: V5Country[]; meta?: { more?: boolean } };
}

function getApiKey(): string {
	const key = env.REST_COUNTRIES_API_KEY;
	if (!key) {
		throw new ApiError(500, 'REST_COUNTRIES_API_KEY mangler. Se README for hvordan du setter den opp.');
	}
	return key;
}

async function request(path: string, params: Record<string, string> = {}) {
	const url = new URL(BASE_URL + path);
	for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

	// Vanlig fetch og ikke event.fetch fra SvelteKit: den legger til en Origin-header,
	// og da tror REST Countries at kallet kommer fra en nettleser og avviser nøkkelen
	const res = await fetch(url, { headers: { Authorization: `Bearer ${getApiKey()}` } });

	if (res.status === 404) throw new ApiError(404, 'Landet ble ikke funnet');
	if (res.status === 401 || res.status === 403) {
		throw new ApiError(500, 'API-nøkkelen ble avvist av REST Countries');
	}
	if (res.status === 429) throw new ApiError(503, 'For mange forespørsler, prøv igjen om litt');
	if (!res.ok) throw new ApiError(502, 'Kunne ikke hente data fra REST Countries');

	const body = (await res.json()) as V5Response;
	return { objects: body.data?.objects ?? [], more: body.data?.meta?.more ?? false };
}

// Lenker fra API-et brukes i href, så vi godtar bare vanlige https-lenker
function safeUrl(url: string | undefined): string {
	return url && url.startsWith('https://') ? url : '';
}

function toCountry(c: V5Country): Country {
	return {
		name: {
			common: c.names?.common ?? '',
			official: c.names?.official ?? '',
			nativeName: c.names?.native
		},
		cca2: c.codes?.alpha_2 ?? '',
		cca3: c.codes?.alpha_3 ?? '',
		capital: c.capitals?.map((cap) => cap.name ?? '').filter(Boolean),
		region: c.region ?? '',
		subregion: c.subregion || undefined,
		population: c.population ?? 0,
		area: c.area?.kilometers,
		flags: {
			png: safeUrl(c.flag?.url_png),
			svg: safeUrl(c.flag?.url_svg),
			alt: c.flag?.description
		},
		currencies: c.currencies
			? Object.fromEntries(
					c.currencies.map((cur) => [cur.code ?? cur.name ?? '', { name: cur.name ?? '', symbol: cur.symbol ?? '' }])
				)
			: undefined,
		languages: c.languages
			? Object.fromEntries(c.languages.map((lang) => [lang.iso639_3 ?? lang.name ?? '', lang.name ?? '']))
			: undefined,
		borders: c.borders,
		timezones: c.timezones,
		continents: c.continents,
		maps: c.links
			? {
					googleMaps: safeUrl(c.links.google_maps),
					openStreetMaps: safeUrl(c.links.open_street_maps)
				}
			: undefined,
		landlocked: c.landlocked,
		independent: c.classification?.sovereign
	};
}

// Enkel cache i minnet, slik at vi ikke treffer rate limit (20 forespørsler per 10 sek) hver gang forsiden lastes
let cache: { countries: Country[]; expires: number } | null = null;

export async function getAllCountries(): Promise<Country[]> {
	if (cache && cache.expires > Date.now()) return cache.countries;

	const all: V5Country[] = [];
	for (let page = 0; page < MAX_PAGES; page++) {
		const { objects, more } = await request('', {
			limit: String(PAGE_SIZE),
			offset: String(page * PAGE_SIZE),
			response_fields: LIST_FIELDS
		});
		all.push(...objects);
		if (!more || objects.length < PAGE_SIZE) break;
	}

	const countries = all.map(toCountry).filter((c) => c.cca3 && c.name.common);
	cache = { countries, expires: Date.now() + CACHE_MS };
	return countries;
}

export async function getCountryByCode(code: string): Promise<Country> {
	// Landkoder er 2 eller 3 bokstaver (cca2/cca3), alt annet avvises før vi kaller API-et
	if (!/^[A-Za-z]{2,3}$/.test(code)) throw new ApiError(400, 'Ugyldig landkode');

	const type = code.length === 2 ? 'alpha_2' : 'alpha_3';
	const { objects } = await request(`/codes.${type}/${code.toUpperCase()}`);
	if (objects.length === 0) throw new ApiError(404, 'Landet ble ikke funnet');
	return toCountry(objects[0]);
}
