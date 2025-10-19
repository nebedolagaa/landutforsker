import type { RequestHandler } from '@sveltejs/kit';

// Minimale felter for listevisning (for mindre data)
const FIELDS = 'name,cca3,flags,population,region,capital';
const EXTERNAL_URL = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const res = await fetch(EXTERNAL_URL);

		if (!res.ok) {
			const text = await res.text();
			return new Response(text || 'Kunne ikke hente land', { status: res.status });
		}

		const data = await res.json();
		return new Response(JSON.stringify(data), {
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
