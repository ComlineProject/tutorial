<script>
	import { pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
</script>


<TutorialPage previous_url={pageUrl("p2-s2")} next_url={pageUrl("p3")}>
	<h2>Protocols</h2>
	<p>This page is coming soon.</p>
</TutorialPage>
