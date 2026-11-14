<script>
	import { baseUrl, pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
</script>


<TutorialPage previous_url={baseUrl} next_url={pageUrl("p1-s1")}>
	<p>Comline is an RPC/IPC schema library, in a Schema you can define data and protocol.</p>
</TutorialPage>
