import { json, type RequestHandler } from '@sveltejs/kit';
import { ApiError, getCountryByCode } from '$lib/server/restcountries';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const country = await getCountryByCode(params.code ?? '');
		return json(country, { headers: { 'cache-control': 'public, max-age=600' } });
	} catch (e) {
		if (e instanceof ApiError) return json({ message: e.message }, { status: e.status });
		console.error('Feil ved henting av land:', e);
		return json({ message: 'Kunne ikke hente landet' }, { status: 502 });
	}
};
