// Typescript-grensesnitt for REST Countries API
export interface Country {
  // Navn på landet
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  // ISO-koder
  cca2: string;
  cca3: string;
  // Hovedstad
  capital?: string[];
  // Region og subregion
  region: string;
  subregion?: string;
  // Befolkning og areal
  population: number;
  area?: number;
  // Flagg
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  // Valuta
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  // Språk
  languages?: {
    [key: string]: string;
  };
  // Naboland
  borders?: string[];
  // Tidssoner
  timezones?: string[];
  // Kontinenter
  continents?: string[];
  // Kartlenker
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
  // Landstatus
  landlocked?: boolean;
  independent?: boolean;
}

export interface CountryListItem {
  // Forenklet landvisning
  name: string;
  code: string;
  flag: string;
  population: number;
  region: string;
  capital?: string;
}
