<script lang="ts">
	import { pageUrl } from '$lib/paging';
	import TutorialPage from '$lib/ui/tutorial_page.svelte';
	import Simulation from '$lib/sim/Simulation.svelte';
</script>

<TutorialPage previous_url={pageUrl('p1-s2')} next_url={pageUrl('p1-s4')}>
	<h2>Try it</h2>
	<p>
		Below is a Chat client and server, both generated from the same schema and wired together. Send a
		call and watch it serialise, cross the connection, get dispatched, and come back.
	</p>
	<p>
		Change what the server does with <code>send</code> — reply, echo the request straight back, or
		drop it and let the client time out.
	</p>

	<Simulation />

	<p>
		This is the real runtime: the same framing, envelope and dispatch the generated code uses, run in
		your browser as WebAssembly.
	</p>
</TutorialPage>
