<script lang="ts">
	// A schema editor for a lesson: the playground's editor (comline-web-kit),
	// with the language server's highlighting, errors, hover and completion,
	// and a Compile button that generates code from the schema.
	import {
		createCompiler,
		makeState,
		mountEditor,
		readOnlyExtensions,
		type Compiler,
		type FileInput,
		type GeneratedFile,
		type LspDiagnostic
	} from 'comline-web-kit/editor';
	import { Compartment, EditorState, type Extension } from '@codemirror/state';
	import { EditorView } from '@codemirror/view';

	interface Props {
		/** The schema's file name; its stem is the namespace. */
		file: string;
		/** What the editor starts with. */
		source: string;
	}
	let { file, source }: Props = $props();

	const TARGETS = [
		{ id: 'rust', name: 'Rust' },
		{ id: 'typescript', name: 'TypeScript' }
	];

	let target = $state('rust');
	let compiling = $state(false);
	/** The errors from the last compile, if it had any. */
	let errors = $state<LspDiagnostic[]>([]);
	/** What the last compile generated, or `null` before the first. */
	let output = $state<GeneratedFile[] | null>(null);
	let shown = $state(0);
	/** The schema changed since the last compile. */
	let stale = $state(false);
	/** The compiler itself failed (not the schema). */
	let failure = $state<string | null>(null);

	let compiler: Compiler | null = null;
	/** The editor's text, as of its last change. */
	let doc = '';
	const project = (): FileInput[] => [{ path: file, source: doc }];

	/** Mounts the editor, and the compiler that feeds it, into `host`. */
	function editor(host: HTMLElement) {
		compiler = createCompiler({ onError: (message) => (failure = message) });
		doc = source;
		const view = mountEditor(
			host,
			makeState(source, {
				bridge: compiler,
				project,
				activeName: () => file,
				onDocChanged: (text) => {
					doc = text;
					stale = output !== null || errors.length > 0;
				}
			})
		);
		return {
			destroy() {
				view.destroy();
				compiler?.terminate();
				compiler = null;
			}
		};
	}

	async function compile() {
		if (!compiler) return;
		compiling = true;
		failure = null;
		const report = await compiler.compileProject(project());
		errors = report.files.flatMap((f) => f.diagnostics).filter((d) => d.severity === 1);
		if (errors.length > 0) {
			output = null;
		} else {
			const generated = await compiler.generateProject(project(), target, 'code');
			if (generated.error) failure = generated.error;
			output = generated.error ? null : generated.files;
			shown = 0;
		}
		stale = false;
		compiling = false;
	}

	const GRAMMARS: Record<string, () => Promise<Extension>> = {
		rs: async () => (await import('@codemirror/lang-rust')).rust(),
		ts: async () => (await import('@codemirror/lang-javascript')).javascript({ typescript: true })
	};

	/** A read-only view of one generated file, highlighted by its extension. */
	function generated(host: HTMLElement, generatedFile: GeneratedFile) {
		const grammar = new Compartment();
		const view = new EditorView({
			parent: host,
			state: EditorState.create({ extensions: [...readOnlyExtensions(), grammar.of([])] })
		});
		async function show(f: GeneratedFile) {
			view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: f.contents } });
			const load = GRAMMARS[f.path.split('.').pop() ?? ''];
			view.dispatch({ effects: grammar.reconfigure(load ? await load() : []) });
		}
		void show(generatedFile);
		return { update: show, destroy: () => view.destroy() };
	}
</script>

<div class="schema-editor">
	<div class="bar">
		<span class="file">{file}</span>
		<label>
			into
			<select bind:value={target} onchange={() => output && compile()}>
				{#each TARGETS as t (t.id)}
					<option value={t.id}>{t.name}</option>
				{/each}
			</select>
		</label>
		<button onclick={compile} disabled={compiling}>{compiling ? 'Compiling…' : 'Compile'}</button>
	</div>

	<!-- The schema on the left, and what compiling it gave on the right. -->
	<div class="panes">
		<div class="code" use:editor></div>

		<div class="result">
			{#if failure}
				<p class="status err">The compiler failed: {failure}</p>
			{:else if errors.length > 0}
				<div class="status err">
					<p>
						{errors.length === 1 ? '1 error' : `${errors.length} errors`}{stale
							? ' (before your last edit)'
							: ''}:
					</p>
					<ul>
						{#each errors as e, i (i)}
							<li>line {e.range.start.line + 1}: {e.message}</li>
						{/each}
					</ul>
				</div>
			{:else if output}
				<p class="status ok">
					Compiled into {output.length === 1 ? '1 file' : `${output.length} files`}{stale
						? ' (before your last edit: compile again to update)'
						: ''}.
				</p>
				{#if output.length > 1}
					<div class="tabs" role="tablist">
						{#each output as f, i (f.path)}
							<button role="tab" aria-selected={i === shown} onclick={() => (shown = i)}>{f.path}</button>
						{/each}
					</div>
				{/if}
				{#if output[shown]}
					<div class="code out" use:generated={output[shown]}></div>
				{/if}
			{:else}
				<p class="status muted">Press Compile to generate code from the schema.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	/* The tutorial's palette (global.css), for the editor's theme. */
	.schema-editor {
		/* --fg, --muted and --border come from the page as they are. */
		--bg: var(--panel-bg);
		--bg-2: var(--bar-bg);
		--cl-tok-kw: var(--tok-kw);
		--cl-tok-type: var(--tok-type);
		--cl-tok-str: var(--tok-str);
		--cl-tok-comment: var(--tok-comment);
		--cl-tok-num: var(--tok-num);
		--cl-tok-ann: var(--tok-ann);
		--cl-tok-var: var(--tok-var);
		--cl-tok-fn: var(--tok-fn);
		--cl-tok-op: var(--tok-op);
		--cl-tok-self: var(--tok-self);
		--cl-active-line: var(--active-line);
		--cl-selection: var(--selection);

		/* It fills the space it's given: the schema on the left, and what
		   compiling it gave on the right. */
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
		height: 100%;
		min-height: 0;
		container-type: inline-size;
		text-align: left;
		font-family: ui-monospace, monospace;
		background: var(--bg);
	}

	.bar {
		display: flex;
		flex: none;
		align-items: center;
		gap: 12px;
		padding: 6px 10px;
		border-bottom: 1px solid var(--border);
		background: var(--bg-2);
	}
	.file {
		flex: 1;
		padding: 0;
		color: var(--fg);
	}
	label {
		padding: 0;
		color: var(--muted);
	}
	select,
	button {
		font: inherit;
		color: var(--btn-fg);
		background: var(--btn-bg);
		border: 2px ridge var(--border);
		padding: 2px 10px;
		cursor: pointer;
	}
	button:hover:not(:disabled) {
		background: var(--btn-hover);
	}
	button:disabled {
		cursor: default;
		opacity: 0.6;
	}

	/* Side by side while there's room for both, stacked when there isn't. */
	.panes {
		display: flex;
		flex: 1;
		min-height: 0;
	}
	.panes > .code,
	.result {
		flex: 1 1 0;
		min-width: 0;
		min-height: 0;
	}
	.result {
		display: flex;
		flex-direction: column;
		border-left: 3px ridge var(--border);
	}
	@container (max-width: 36rem) {
		.panes {
			flex-direction: column;
		}
		.result {
			border-left: none;
			border-top: 3px ridge var(--border);
		}
	}

	.code {
		min-height: 6rem;
		overflow: hidden;
	}
	.code.out {
		flex: 1;
		border-top: 1px solid var(--border);
	}

	.status {
		flex: none;
		max-height: 40%;
		overflow-y: auto;
		margin: 0;
		padding: 8px 10px;
		background: var(--bg-2);
	}
	.status.muted {
		flex: 1;
		max-height: none;
		background: none;
	}
	.status p {
		margin: 0;
		padding: 0;
		color: inherit;
	}
	.status ul {
		margin: 4px 0 0;
		padding-left: 1.2rem;
	}
	.status li {
		color: inherit;
		font-family: ui-monospace, monospace;
		font-size: 0.85rem;
	}
	.ok {
		color: var(--ok);
	}
	.err {
		color: var(--err);
	}
	.muted {
		color: var(--muted);
	}

	.tabs {
		display: flex;
		flex: none;
		flex-wrap: wrap;
		gap: 4px;
		padding: 0 10px 6px;
		background: var(--bg-2);
	}
	.tabs button {
		font-family: ui-monospace, monospace;
		font-size: 0.8rem;
	}
	.tabs button[aria-selected='true'] {
		background: var(--bg-2);
		color: var(--fg);
	}
</style>
