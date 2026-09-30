import type { PageLoad } from './$types';
import { CountryApiError, fetchCountryByCode } from '$lib/api/countries';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const country = await fetchCountryByCode(params.code, fetch);
		return { country };
	} catch (err) {
		// Skill mellom land som ikke finnes og andre feil (nettverk, API-nøkkel osv.)
		if (err instanceof CountryApiError && (err.status === 404 || err.status === 400)) {
			error(404, 'Land er ikke funnet');
		}
		error(502, err instanceof CountryApiError ? err.message : 'Kunne ikke laste landet');
	}
};
