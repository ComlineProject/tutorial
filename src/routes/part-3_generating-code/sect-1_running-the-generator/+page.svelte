<script>
	import { pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
</script>


<TutorialPage previous_url={pageUrl("p3")} next_url={pageUrl("p3-s2")}>
	<h2>Running the generator</h2>
	<p>This page is coming soon.</p>
</TutorialPage>
