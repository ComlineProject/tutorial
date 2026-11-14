import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	// comline-web-kit ships TypeScript with `?url` WASM imports, which Vite's
	// dependency pre-bundling can't handle: serve it as source instead.
	optimizeDeps: {
		exclude: ['comline-web-kit']
	},
	// The kit's compiler runs in a module worker (`type: "module"`), which the
	// build has to emit as an ES module too.
	worker: {
		format: 'es'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
