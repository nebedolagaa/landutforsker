<script lang="ts">
	import type { PageData } from './$types';
	import { filterCountries, getUniqueRegions } from '$lib/api/countries';
	import type { CountryListItem } from '$lib/types/country';

	export let data: PageData;

	let searchTerm = '';
	let selectedRegion = 'all';
	let currentPage = 1;
	let itemsPerPage = 10;

	$: allCountries = Array.isArray(data?.countries) ? (data.countries as CountryListItem[]) : [];
	$: regions = getUniqueRegions(allCountries ?? []);
	$: filteredCountries = filterCountries(allCountries ?? [], searchTerm, selectedRegion);
	$: totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
	$: {
		// Tilbakestill til side 1 når filtrene endres
		if (currentPage > totalPages && totalPages > 0) {
			currentPage = 1;
		}
	}
	$: paginatedCountries = (filteredCountries ?? []).slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Sikrer at videt blir aldri gjengitt udefinerte oppføringer
	$: safeCountries = (paginatedCountries ?? []).filter(
		(c): c is CountryListItem => !!c && typeof c.name === 'string'
	);

	// Generer sidetall for paginering
	$: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function formatPopulation(population: number): string {
		return population.toLocaleString();
	}
</script>

<section class="hero">
  <h1>Utforsk land</h1>
  <p class="hint">Her kan du se {allCountries.length} land.</p>
</section>

<!-- Søk og filter -->
<section class="panel">
  <div class="field">
    <label for="search">Søk etter navn eller hovedstad</label>
    <input id="search" type="text" placeholder="Skriv inn noe..." bind:value={searchTerm} />
  </div>

  <div class="field">
    <label for="region">Filtrer etter region</label>
    <select id="region" bind:value={selectedRegion}>
      <option value="all">Alle regioner</option>
      {#each regions as region}
        <option value={region}>{region}</option>
      {/each}
    </select>
  </div>

  <div class="field small">
    <label for="itemsPerPage">Antall per side</label>
    <select id="itemsPerPage" bind:value={itemsPerPage}>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
  </div>
</section>

<p class="muted">
  Viser {filteredCountries.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
  - {Math.min(currentPage * itemsPerPage, filteredCountries.length)} av {filteredCountries.length} land
</p>

{#if paginatedCountries.length === 0}
  <div class="empty">
    <strong>Ingen land funnet.</strong>
    <div>Prøv å endre søket eller filteret.</div>
  </div>
{:else}
  <div class="grid">
    {#each safeCountries as country, i (country?.code ?? i)}
      <a class="card" href="/country/{country?.code}" data-sveltekit-preload-data="off">
        <img src={country?.flag || ''} alt={(country?.name || 'Ukjent') + ' flagg'} />
        <div class="body">
          <div class="title">{country?.name ?? 'Ukjent'}</div>
          <div class="row"><span class="label">Hovedstad:</span> {country?.capital || 'Ingen'}</div>
          <div class="row"><span class="label">Region:</span> {country?.region ?? 'Ukjent'}</div>
          <div class="row"><span class="label">Befolkning:</span> {formatPopulation(country?.population ?? 0)}</div>
        </div>
      </a>
    {/each}
  </div>

  {#if totalPages > 1}
    <div class="pager">
      <button on:click={() => goToPage(1)} disabled={currentPage === 1}>&laquo;&laquo;</button>
      <button on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
      {#each pageNumbers.filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2) as page}
        <button class:active={currentPage === page} on:click={() => goToPage(page)}>{page}</button>
      {/each}
      <button on:click={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
      <button on:click={() => goToPage(totalPages)} disabled={currentPage === totalPages}>&raquo;&raquo;</button>
    </div>
  {/if}
{/if}

<style>
  .hero h1 {
    margin: 0 0 6px;
  }

  .hint {
    color: #666;
    margin: 0 0 12px;
  }

  .panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    padding: 12px;
    border-radius: 6px;
    display: grid;
    grid-template-columns: 1fr 220px 160px;
    gap: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field.small select {
    max-width: 140px;
  }

  input,
  select {
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    font-size: 0.95rem;
    transition: border 0.18s, box-shadow 0.18s;
  }

  input:focus,
  select:focus {
    border: 1.5px solid #00263e;
    box-shadow: 0 0 0 3px rgba(0, 38, 62, 0.15);
    outline: none;
  }

  label {
    font-size: 0.9rem;
    color: #334155;
  }

  .muted {
    color: #666;
    margin: 10px 2px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
    margin-top: 12px;
  }

  .card {
    display: flex;
    flex-direction: row;
    gap: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
    transition: box-shadow 0.22s, transform 0.18s;
    will-change: box-shadow, transform;
  }

  .card:hover {
    box-shadow: 0 6px 24px 0 rgba(0,32,54,0.13);
    transform: translateY(-2px) scale(1.025);
    border-color: #b6d4fe;
    z-index: 2;
  }

  .card img {
    width: 36%;
    height: 120px;
    object-fit: cover;
  }

  .card .body {
    padding: 8px 8px 10px;
  }

  .card .title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .row {
    font-size: 0.92rem;
    color: #374151;
    margin: 2px 0;
  }

  .label {
    color: #6b7280;
    margin-right: 6px;
  }

  .pager {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin: 16px 0;
  }

  .pager button {
    padding: 6px 9px;
    border: 1px solid #cbd5e1;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
  }

  .pager button:hover:not([disabled]) {
    background: #e0e7ff;
    color: #00263e;
    box-shadow: 0 2px 8px 0 rgba(0, 38, 62, 0.12);
    border-color: #00263e;
  }

  .pager button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pager button.active {
    background: #00263e;
    color: white;
    border-color: #00263e;
  }

  .empty {
    padding: 18px;
    background: #fff;
    border: 1px dashed #cbd5e1;
    border-radius: 6px;
    color: #475569;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 800px) {
    .panel {
      grid-template-columns: 1fr;
    }
  }
</style>
