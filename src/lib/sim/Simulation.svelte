<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import init, { Sim } from 'comline-simulator';
	import wasmUrl from 'comline-simulator/pkg/comline_simulator_bg.wasm?url';
	import lesson from '$lib/sim/lessons/chat.lesson.json';

	interface Frame {
		seq: number;
		from: string;
		to: string;
		bytes: number[];
		at: number;
		kind: string;
	}
	interface Instance {
		id: string;
		name: string;
		role: 'client' | 'server';
		protocol: string;
		behaviors: Record<string, { kind: string }>;
	}
	interface Model {
		instances: Instance[];
		connections: { id: string; clientId: string; serverId: string }[];
	}

	const BEHAVIOURS = [
		{ kind: 'reply', label: 'reply (a default Message)' },
		{ kind: 'echo', label: 'echo (bounce the request back)' },
		{ kind: 'drop', label: 'drop (never answer)' }
	];

	let sim: Sim | null = null;
	let model = $state<Model | null>(null);
	let frames = $state<Frame[]>([]);
	let text = $state('hello');
	let result = $state<string | null>(null);
	let busy = $state(false);
	let error = $state<string | null>(null);

	const client = $derived(model?.instances.find((i) => i.role === 'client') ?? null);
	const server = $derived(model?.instances.find((i) => i.role === 'server') ?? null);
	const conn = $derived(model?.connections[0] ?? null);
	const behaviour = $derived(server?.behaviors['send']?.kind ?? 'reply');

	function refresh() {
		if (!sim) return;
		model = JSON.parse(sim.session_json()) as Model;
		const c = model.connections[0];
		frames = c ? (JSON.parse(sim.frames(c.id)) as Frame[]) : [];
	}

	function setBehaviour(kind: string) {
		if (!sim || !server) return;
		sim.set_behavior(server.id, 'send', kind, '{}');
		result = null;
		refresh();
	}

	function send() {
		if (!sim || !conn || busy) return;
		busy = true;
		result = null;
		try {
			const id = sim.call(conn.id, 'send', JSON.stringify({ text }));
			// canned behaviours settle fast; the cap also covers `drop` → timeout
			for (let i = 0; i < 400 && sim.pending() > 0; i++) sim.advance(25);
			const raw = sim.result(id);
			const r = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
			result =
				r === null
					? 'still in flight'
					: r.status === 'ok'
						? `reply · ${JSON.stringify(r.value)}`
						: r.status === 'err'
							? `error ${r.ordinal} · ${JSON.stringify(r.body)}`
							: r.status === 'timeout'
								? 'timed out — no reply came back'
								: String(r.status);
		} finally {
			busy = false;
			refresh();
		}
	}

	onMount(async () => {
		try {
			await init({ module_or_path: wasmUrl });
			sim = new Sim(JSON.stringify(lesson.shape), lesson.session);
			sim.set_call_timeout(2000);
			refresh();
		} catch (e) {
			error = `could not start the simulation · ${(e as Error).message ?? e}`;
		}
	});

	onDestroy(() => sim?.free());
</script>

<div class="sim">
	{#if error}
		<p class="err">{error}</p>
	{:else if !model}
		<p class="muted">loading the simulation…</p>
	{:else}
		<div class="wire">
			<div class="node client">{client?.name ?? 'client'}<span>{client?.protocol} client</span></div>
			<div class="link" class:dropping={behaviour === 'drop'}></div>
			<div class="node server">{server?.name ?? 'server'}<span>{server?.protocol} server</span></div>
		</div>

		<label class="ctl">
			server answers <code>send</code> with
			<select value={behaviour} onchange={(e) => setBehaviour(e.currentTarget.value)}>
				{#each BEHAVIOURS as b (b.kind)}
					<option value={b.kind}>{b.label}</option>
				{/each}
			</select>
		</label>

		<form
			class="ctl call"
			onsubmit={(e) => {
				e.preventDefault();
				send();
			}}
		>
			<code>send</code>(<input bind:value={text} aria-label="text argument" />)
			<button type="submit" disabled={busy}>send</button>
		</form>

		{#if result}
			<p class="result">{result}</p>
		{/if}

		<ol class="frames">
			{#each frames as f (f.seq)}
				<li>
					<span class="seq">{String(f.seq).padStart(2, '0')}</span>
					<span class="dir">{f.from} → {f.to}</span>
					<span class="kind">{f.kind}</span>
					<span class="len">{f.bytes.length} B</span>
				</li>
			{:else}
				<li class="muted">no frames yet — send a call</li>
			{/each}
		</ol>
	{/if}
</div>

<style>
	.sim {
		width: min(100%, 32rem);
		margin: 1rem auto;
		padding: 0.9rem;
		text-align: left;
		border-style: ridge;
		border-color: #614a39;
	}
	.wire {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.9rem;
	}
	.node {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
		background-color: #322922;
		color: #dbb594;
		border-style: ridge;
		border-color: #4d3c2f;
	}
	.node span {
		font-size: 0.75rem;
		opacity: 0.7;
	}
	.link {
		flex: 0 0 2.5rem;
		height: 2px;
		background: #dbb594;
	}
	.link.dropping {
		background: repeating-linear-gradient(90deg, #dbb594 0 4px, transparent 4px 8px);
	}
	.ctl {
		display: block;
		margin: 0.5rem 0;
	}
	.ctl.call {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		flex-wrap: wrap;
	}
	.ctl input {
		flex: 1;
		min-width: 6rem;
	}
	select,
	input,
	button {
		font: inherit;
	}
	button {
		padding: 0.2rem 0.8rem;
		background-color: #322922;
		color: #dbb594;
		border-color: #4d3c2f;
		border-style: ridge;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.result {
		margin: 0.5rem 0;
		padding: 0.4rem 0.6rem;
		background: #2a211d;
		color: #dbb594;
	}
	.frames {
		list-style: none;
		margin: 0.6rem 0 0;
		padding: 0;
		font-size: 0.85rem;
	}
	.frames li {
		display: flex;
		gap: 0.6rem;
		padding: 0.15rem 0;
		border-top: 1px solid #4d3c2f;
	}
	.frames .seq {
		opacity: 0.6;
	}
	.frames .len {
		margin-left: auto;
		opacity: 0.6;
	}
	.muted {
		opacity: 0.6;
	}
	.err {
		color: #f7768e;
	}
</style>
