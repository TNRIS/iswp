import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg'
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(),
		svg()],
	build: {
        sourcemap: true,
		minify: false
    },
});
