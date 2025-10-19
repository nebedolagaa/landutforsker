import type { RequestHandler } from '@sveltejs/kit';

const FIELDS = 'name,cca2,cca3,capital,region,subregion,population,area,flags,currencies,languages,borders,timezones,continents,maps,landlocked,independent';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { code } = params;
	const codeLower = (code || '').toLowerCase();
	const url = `https://restcountries.com/v3.1/alpha?codes=${encodeURIComponent(codeLower)}&fields=${FIELDS}`;
	try {
		const res = await fetch(url);
		if (!res.ok) {
			const text = await res.text();
			return new Response(text || 'Kunne ikke hente land', { status: res.status });
		}
		const data = await res.json();
		const item = Array.isArray(data) ? data[0] : data;
		if (!item) {
			return new Response('Landet ble ikke funnet', { status: 404 });
		}
		return new Response(JSON.stringify(item), {
			status: 200,
			headers: {
				'content-type': 'application/json',
				'cache-control': 'public, max-age=600'
			}
		});
	} catch (e: any) {
		return new Response(e?.message || 'Feil mot oppstrøms-tjeneste', { status: 502 });
	}
};
