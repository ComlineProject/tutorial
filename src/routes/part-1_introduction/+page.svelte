<script>
	import { pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
</script>


<TutorialPage previous_url="/" next_url={pageUrl("p1-s1")}>
    <p>Comline is...</p>
</TutorialPage>

