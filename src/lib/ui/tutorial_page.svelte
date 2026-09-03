<script lang="ts">
	import NavigationButton from "./navigation_button.svelte";
	import NavigationTable from "./navigation_table.svelte";

    export let previous_url: string | null;
    export let next_url: string | null;
</script>


<div class="page">
    <NavigationTable/>
    <slot/>
</div>
<div class="buttons">
   <NavigationButton href_url={previous_url ?? ''}
        text="Back" disabled={previous_url === null}
    />
    <NavigationButton href_url={next_url ?? ''}
        text="Next" disabled={next_url === null}
    />
</div>


<style>
    .page {
        display: flex;
    }
    .buttons {
        display: flex;
        gap: 4pt;
    }
</style>
