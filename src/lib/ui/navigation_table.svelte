<script lang="ts">
    import "../../styles/global.css"
    import { PAGES, pageUrl } from "$lib/paging";
</script>


<nav class="commonBox">
    {#each PAGES as page}
        <a href={pageUrl(page.id) ?? '#'}>{page.name}</a>
    {/each}
</nav>


<style>
</style>
