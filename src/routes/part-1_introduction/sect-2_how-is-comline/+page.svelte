<script>
	import { pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
</script>


<TutorialPage previous_url={pageUrl("p1-s1")} next_url={pageUrl("p1-s3")}>
    <p>Comline is...</p>
</TutorialPage>

