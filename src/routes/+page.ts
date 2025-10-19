import type { PageLoad } from "./$types";
import { fetchAllCountries, toCountryListItem } from "$lib/api/countries";
import type { CountryListItem } from "$lib/types/country";

export const ssr = false; // jeg kjører alt i nettleser for enkelhet

export const load: PageLoad = async ({ fetch }) => {
  try {
    console.log('Laster land...');
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

    return { countries: countryList };
  } catch (error) {
    console.error("Feil ved lasting av land:", error);
    return { countries: [] };
  }
};
