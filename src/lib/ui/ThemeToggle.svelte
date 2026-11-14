<script lang="ts">
	// Switches between the dark theme (the default) and the light one, and
	// remembers the choice in this browser. app.html applies it on load.
	let light = $state(document.documentElement.dataset.theme === 'light');

	function toggle() {
		light = !light;
		if (light) document.documentElement.dataset.theme = 'light';
		else delete document.documentElement.dataset.theme;
		try {
			if (light) localStorage.setItem('theme', 'light');
			else localStorage.removeItem('theme');
		} catch {
			// Storage is off (a private window): the choice lasts for this page.
		}
	}
</script>

<button
	class="toggle"
	onclick={toggle}
	aria-pressed={light}
	title={light ? 'Switch to the dark theme' : 'Switch to the light theme'}
>
	{light ? '☾' : '☀'}<span class="label">{light ? ' Dark' : ' Light'}</span>
</button>

<style>
	.toggle {
		font-family: 'VT323', monospace;
		font-size: 1rem;
		padding: 4px 12px;
		cursor: pointer;
		color: var(--btn-fg);
		background-color: var(--btn-bg);
		border: 2px ridge var(--btn-border);
	}
	.toggle:hover {
		background-color: var(--btn-hover);
	}
	/* On a phone the title needs the room: the symbol alone. */
	@media (max-width: 640px) {
		.label {
			display: none;
		}
	}
</style>
