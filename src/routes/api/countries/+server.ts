import { json, type RequestHandler } from '@sveltejs/kit';
import { ApiError, getAllCountries } from '$lib/server/restcountries';

export const GET: RequestHandler = async () => {
	try {
		const countries = await getAllCountries();
		// Listen trenger bare noen få felter, så vi sender ikke mer enn nødvendig til nettleseren
		const list = countries.map((c) => ({
			name: c.name,
			cca2: c.cca2,
			cca3: c.cca3,
			flags: c.flags,
			population: c.population,
			region: c.region,
			capital: c.capital
		}));
		return json(list, { headers: { 'cache-control': 'public, max-age=600' } });
	} catch (e) {
		if (e instanceof ApiError) return json({ message: e.message }, { status: e.status });
		console.error('Feil ved henting av land:', e);
		return json({ message: 'Kunne ikke hente land' }, { status: 502 });
	}
};
