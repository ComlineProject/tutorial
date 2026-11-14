<script lang="ts">
	// The "Try it" lesson: the playground's simulate view (comline-web-kit) in
	// its lesson layout, on the Chat client and server that chat.lesson.json
	// wires together. It opens on the client's calls; clicking the server
	// shows what it answers `send` with.
	import { createSim, loadSim, type ProjectShape, type SimView } from 'comline-web-kit/sim';
	import 'comline-web-kit/sim.css';
	import lesson from '$lib/sim/lessons/chat.lesson.json';

	let loading = $state(true);
	let error = $state<string | null>(null);

	/** Mounts the view into `host` once its engine has loaded. */
	function simulation(host: HTMLElement) {
		let view: SimView | null = null;
		let gone = false;
		loadSim()
			.then(() => {
				if (gone) return;
				view = createSim({
					layout: 'lesson',
					behaviours: ['reply', 'echo', 'drop'],
					select: 'chat-2'
				});
				host.append(view.el);
				view.setShape(lesson.shape as ProjectShape, lesson.session);
			})
			.catch((e) => {
				error = `could not start the simulation · ${(e as Error).message ?? e}`;
			})
			.finally(() => {
				loading = false;
			});
		return {
			destroy() {
				gone = true;
				view?.destroy();
			}
		};
	}
</script>

<div class="lesson-sim">
	{#if error}
		<p class="err">{error}</p>
	{:else if loading}
		<p class="muted">loading the simulation…</p>
	{/if}
	<div use:simulation></div>
</div>

<style>
	/* The tutorial's palette, for the view's --cl-* properties. */
	.lesson-sim {
		--cl-bg: #1a1714;
		--cl-bg-2: #322922;
		--cl-fg: #f2e1ca;
		--cl-muted: #a8927a;
		--cl-accent: #dbb594;
		--cl-border: #614a39;

		width: min(100%, 40rem);
		margin: 1rem auto;
		text-align: left;
	}
	.muted {
		opacity: 0.6;
	}
	.err {
		color: #f7768e;
	}
</style>
