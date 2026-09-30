<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: country = data.country;

	function formatPopulation(population: number): string {
		return population.toLocaleString('nb-NO');
	}

	function formatArea(area: number | undefined): string {
    return area ? area.toLocaleString('nb-NO') + ' km²' : 'Ukjent';
	}

	function getCurrencyString(
		currencies: { [key: string]: { name: string; symbol: string } } | undefined
	): string {
    if (!currencies) return 'Ingen';
		return Object.values(currencies)
			.map((c) => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
			.join(', ');
	}

	function getLanguagesString(languages: { [key: string]: string } | undefined): string {
    if (!languages) return 'Ingen';
		return Object.values(languages).join(', ');
	}

	function getTimezonesString(timezones: string[] | undefined): string {
    if (!timezones || timezones.length === 0) return 'Ingen';
		return timezones.join(', ');
	}

	function getNativeNameString(
		nativeName: { [key: string]: { official: string; common: string } } | undefined
	): string {
    if (!nativeName) return 'Ukjent';
		// Flere språk har ofte samme navn, så vi fjerner duplikater
		const names = new Set(Object.values(nativeName).map((n) => n.common));
		return Array.from(names).join(', ');
	}
</script>

{#if country}
  <a class="back" href="/">← Tilbake</a>

  <div class="detail">
    <div class="flag">
      <img src={country?.flags?.svg || country?.flags?.png || ''} alt={(country?.name?.common || 'Ukjent') + ' flagg'} />
    </div>
    <div class="info">
      <h1>{country?.name?.common}</h1>
      <div class="muted">{country?.name?.official}</div>

      <div class="row">
        <div class="col">
          <div class="label">Opprinnelig navn:</div>
          <div>{getNativeNameString(country?.name?.nativeName)}</div>
        </div>
        <div class="col">
          <div class="label">Hovedstad:</div>
          <div>{country?.capital?.join(', ') || 'Ingen'}</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">Region:</div>
          <div>{country?.region}</div>
        </div>
        <div class="col">
          <div class="label">Subregion:</div>
          <div>{country?.subregion || 'Ingen'}</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">Befolkning:</div>
          <div>{formatPopulation(country?.population ?? 0)}</div>
        </div>
        <div class="col">
          <div class="label">Areal:</div>
          <div>{formatArea(country?.area)}</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">Valuta:</div>
          <div>{getCurrencyString(country?.currencies)}</div>
        </div>
        <div class="col">
          <div class="label">Språk:</div>
          <div>{getLanguagesString(country?.languages)}</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">Tidssoner:</div>
          <div>{getTimezonesString(country?.timezones)}</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">Landskoder:</div>
          <div class="chips">
            <span class="chip">{country?.cca2}</span>
            <span class="chip">{country?.cca3}</span>
          </div>
        </div>
        <div class="col">
          <div class="label">Status:</div>
          <div class="chips">
            {#if country?.independent}
              <span class="chip ok">Selvstendig</span>
            {:else}
              <span class="chip info">Avhengig</span>
            {/if}
            {#if country?.landlocked}
              <span class="chip warn">Innelåst</span>
            {/if}
          </div>
        </div>
      </div>

      {#if country?.borders && country.borders.length > 0}
        <div class="row">
          <div class="col">
            <div class="label">Naboland:</div>
            <div class="chips">
              {#each country?.borders as border}
                <a class="chip link" href="/country/{border}">{border}</a>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      {#if country?.maps}
        <div class="row">
          <div class="col">
            <div class="label">Kart:</div>
            <div class="actions">
              {#if country.maps.googleMaps}
                <a class="btn" href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">Åpne i Google Maps</a>
              {/if}
              {#if country.maps.openStreetMaps}
                <a class="btn ghost" href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer">Åpne i OpenStreetMap</a>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="loading">
    <div class="spinner" aria-hidden="true"></div>
    <div>Laster landdetaljer…</div>
  </div>
{/if}

<style>
  .back {
    display: inline-block;
    margin-bottom: 10px;
    color: #00263e;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.18s;
  }

  .back:hover {
    color: #004d7a;
  }

  .detail {
    display: grid;
    grid-template-columns: minmax(240px, 420px) 1fr;
    gap: 16px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  }

  .flag {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: #f1f5f9;
  }

  /* contain i stedet for cover, ellers blir flagget kuttet */
  .flag img {
    width: 100%;
    max-height: 320px;
    object-fit: contain;
    display: block;
  }
    
  .info {
    padding: 12px 14px 16px;
  }

  .muted {
    color: #6b7280;
    margin-bottom: 10px;
  }

  h1 {
    margin: 4px 0 2px;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 10px 0;
  }

  .label {
    font-size: 0.85rem;
    color: #475569;
    margin-bottom: 5px;
  }
    
  .chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .chip {
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    color: #1e3a8a;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 0.85rem;
    transition: background 0.18s, box-shadow 0.18s;
  }

  .chip.ok {
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  }

  .chip.info {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1e40af;
  }

  .chip.warn {
    background: #fffbeb;
    border-color: #fde68a;
    color: #92400e;
  }

  .chip.link {
    text-decoration: none;
  }

  .chip.link:hover {
    background: #dbeafe;
    box-shadow: 0 2px 6px 0 rgba(0, 38, 62, 0.10);
  }
    
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn {
    background: #00263e;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    text-decoration: none;
    border: 1px solid #00263e;
    transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
    box-shadow: 0 2px 6px 0 rgba(0, 38, 62, 0.15);
  }

  .btn:hover {
    background: #004d7a;
    box-shadow: 0 4px 12px 0 rgba(0, 38, 62, 0.25);
    transform: translateY(-1px);
  }

  .btn.ghost {
    background: #fff;
    color: #00263e;
  }

  .btn.ghost:hover {
    background: #f0f9ff;
    box-shadow: 0 4px 12px 0 rgba(0, 38, 62, 0.18);
  }
    
  .loading {
    display: grid;
    place-items: center;
    min-height: 50vh;
    color: #6b7280;
    gap: 10px;
  }

  .spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #cbd5e1;
    border-top-color: #00263e;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 800px) {
    .detail {
      grid-template-columns: 1fr;
      max-width: 100%;
    }
  }
</style>
