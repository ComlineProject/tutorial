<script lang="ts" module>
	type Kind = 'kw' | 'type' | 'str' | 'num' | 'ann' | 'comment' | null;

	const KEYWORDS = new Set(['struct', 'enum', 'error', 'protocol', 'function', 'use', 'const']);
	const BUILTINS = new Set([
		'string', 'bool', 'bytes', 'u8', 'u16', 'u32', 'u64', 'i8', 'i16', 'i32', 'i64', 'f32', 'f64'
	]);
	const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(@\w+)|(\b\d+\b)|([A-Za-z_]\w*)|(\s+|.)/gm;

	/** Splits a schema snippet into runs, each with what it is. A fragment
	 *  (`age: u8`) needn't parse, so this goes by the shape of each word, and
	 *  a capitalised name counts as a type. */
	function tokenize(src: string): { text: string; kind: Kind }[] {
		const out: { text: string; kind: Kind }[] = [];
		for (const m of src.matchAll(TOKEN)) {
			const [text, comment, str, ann, num, word] = m;
			let kind: Kind = null;
			if (comment) kind = 'comment';
			else if (str) kind = 'str';
			else if (ann) kind = 'ann';
			else if (num) kind = 'num';
			else if (word && KEYWORDS.has(word)) kind = 'kw';
			else if (word && (BUILTINS.has(word) || /^[A-Z]/.test(word))) kind = 'type';
			out.push({ text, kind });
		}
		return out;
	}
</script>

<script lang="ts">
	// Inline Comline in lesson text, coloured as the schema editor colours it.
	let { src }: { src: string } = $props();
	const tokens = $derived(tokenize(src));
</script>

<code class="schema">{#each tokens as t, i (i)}<span class={t.kind ? `tok-${t.kind}` : undefined}
			>{t.text}</span
		>{/each}</code
>

<style>
	/* The schema editor's colours (global.css's --tok-*). */
	.schema {
		padding: 1px 4px;
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		color: var(--fg);
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 3px;
		white-space: nowrap;
	}
	.tok-kw {
		color: var(--tok-kw);
	}
	.tok-type {
		color: var(--tok-type);
	}
	.tok-str {
		color: var(--tok-str);
	}
	.tok-num {
		color: var(--tok-num);
	}
	.tok-ann {
		color: var(--tok-ann);
	}
	.tok-comment {
		color: var(--tok-comment);
		font-style: italic;
	}
</style>
