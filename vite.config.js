import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg'
import { defineConfig } from 'vite';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
    plugins: [sveltePreprocess(), sveltekit(), svg()],
    build: {
        sourcemap: true,
        minify: false
    }
});
