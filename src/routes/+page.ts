import type { PageLoad } from "./$types";
import { CountryApiError, fetchAllCountries, toCountryListItem } from "$lib/api/countries";
import type { CountryListItem } from "$lib/types/country";

export const ssr = false; // jeg kjører alt i nettleseren for enkelhets skyld

export const load: PageLoad = async ({ fetch }) => {
  try {
    const countries = await fetchAllCountries(fetch);
    const countryList: CountryListItem[] = (Array.isArray(countries) ? countries : [])
      .map((c) => {
        try {
          return toCountryListItem(c as any);
        } catch (e) {
          console.warn('Klarte ikke å mappe land, hopper over', e);
          return null as any;
        }
      })
      .filter((c): c is CountryListItem => !!c && !!c.name);

    countryList.sort((a, b) => a.name.localeCompare(b.name));

    return { countries: countryList, error: null };
  } catch (error) {
    console.error("Feil ved lasting av land:", error);
    const message = error instanceof CountryApiError ? error.message : 'Kunne ikke laste land';
    return { countries: [] as CountryListItem[], error: message };
  }
};
