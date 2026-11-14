import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	// comline-web-kit ships TypeScript with `?url` WASM imports, which Vite's
	// dependency pre-bundling can't handle: serve it as source instead.
	optimizeDeps: {
		exclude: ['comline-web-kit']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
