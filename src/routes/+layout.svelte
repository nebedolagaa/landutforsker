<script lang="ts">
	import { navigating, page } from '$app/stores';
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

<!-- Vises mens neste side henter data (load kjører før siden vises) -->
{#if $navigating}
	<div class="progress" aria-label="Laster"></div>
{/if}

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
		min-height: calc(100vh - 70px - 48px);
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

	.progress {
		position: fixed;
		top: 0;
		left: 0;
		height: 3px;
		width: 100%;
		background: linear-gradient(90deg, transparent, #4da3ff, transparent);
		background-size: 50% 100%;
		background-repeat: no-repeat;
		animation: loading 1s linear infinite;
		z-index: 10;
	}

	@keyframes loading {
		from {
			background-position: -50% 0;
		}
		to {
			background-position: 150% 0;
		}
	}

	.small {
		font-size: 0.9rem;
	}
  
	@media (max-width: 800px) {
		.main {
			max-width: 93%;
		}
		.nav a {
			margin-right: 20px;
		}
	}
</style>
