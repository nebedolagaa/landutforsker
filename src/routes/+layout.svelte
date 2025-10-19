<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Landutforsker</title>
</svelte:head>

<header class="topbar">
	<div class="wrap">
		<a class="logo" href="/">Landutforsker</a>
		<nav class="nav">
			<a href="/" class:active={$page.url.pathname === '/'}>Hjem</a>
		</nav>
	</div>
</header>

<main class="wrap main">
	<slot />
</main>

<footer class="footer">
	<div class="wrap small">
		Data fra
		<a href="https://restcountries.com/" target="_blank" rel="noreferrer">REST Countries API</a>
	</div>
</footer>

<style>
	:global(html, body) {
		padding: 0;
		margin: 0;
		font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
		background: #f6f7f9;
		color: #222;
	}

	.wrap {
		width: 100%;
		max-width: 980px;
		margin: 0 auto;
		padding: 0 12px;
	}

	.topbar {
		background: rgb(0, 32, 54);
		color: #ffffff;
	}

	.topbar .wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 70px;
	}

	.logo {
		text-decoration: none;
		color: #ffffff;
		font-weight: 700;
	}

	.nav a {
		color: #ffffff;
		text-decoration: none;
		padding: 6px 8px;
		border-radius: 4px;
	}

	.nav a.active {
		background: rgba(255,255,255,0.15);
	}

	.main {
		padding: 50px 12px 24px;
		min-height: calc(100vh - 56px - 60px);
	}

	.footer {
		padding: 14px 0;
		background: rgb(0, 32, 54);
		color: #ffffff;
		text-align: center;
	}

	.footer a {
		color: #ffffff;
	}

	.small {
		font-size: 0.9rem;
	}
  
	@media (max-width: 800px) {
		.main {
			grid-template-columns: 1fr;
			max-width: 93%;
		}
		.nav a {
			margin-right: 20px;
		}
	}
</style>
