<script lang="ts">
	import NavigationButton from "./navigation_button.svelte";

    export let previous_url: string | null;
    export let next_url: string | null;
</script>


<slot/>
<div class="buttons">
   <NavigationButton href_url={previous_url ?? ''}
        text="Previous" disabled={previous_url === null}
    />
    <NavigationButton href_url={next_url ?? ''}
        text="Next" disabled={next_url === null}
    />
</div>


<style>
    .buttons {
        display: flex;
        gap: 2pt;
    }
</style>
