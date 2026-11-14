<script>
	import { pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
</script>


<TutorialPage previous_url={pageUrl("p1-s3")} next_url={pageUrl("p2-s1")}>
	<h2>Basics</h2>
	<p>This page is coming soon.</p>
</TutorialPage>
