import type { PageLoad } from './$types';
import { fetchCountryByCode } from '$lib/api/countries';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const country = await fetchCountryByCode(params.code, fetch);
		return { country };
	} catch (err) {
		throw error(404, 'Land er ikke funnet');
	}
};
