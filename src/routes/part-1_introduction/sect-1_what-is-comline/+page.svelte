<script>
	import { pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
</script>


<TutorialPage previous_url={pageUrl("p1")} next_url={pageUrl("p1-s2")}>
	<h2>What is Comline?</h2>
    <p>Comline is or can be a couple things:</p>
	<ul class="points">
		<li>a compiler</li>
		<li>a schema language</li>
		<li>a code generator</li>
		<li>a package manager</li>
		<li>and some more</li>
	</ul>
	<p>Let's go over them one by one, in a simple way.</p>
</TutorialPage>

<style>
	.points {
		text-align: left;
	}
</style>
