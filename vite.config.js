import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';
/** @type {import('vite').UserConfig} */

export default defineConfig({
    plugins: [sveltekit(), svg()],
    build: {
		// inline all imported assets
		assetsInlineLimit: Infinity,
		sourcemap: true,
        minify: true
	}
});