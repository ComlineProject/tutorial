<script lang="ts">
    import "../styles/global.css"

	import { pageUrl } from "$lib/paging";
    import NavigationButton from "$lib/ui/navigation_button.svelte";
</script>


<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<NavigationButton href_url={pageUrl("p1")} text="Start tutorial"/>


<style>
</style>
