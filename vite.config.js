import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg'
import { defineConfig } from 'vite';

// Please do not set minify to true so this will work with LibreJS. -L
export default defineConfig({
	plugins: [sveltekit(),
		svg()],
	build: {
        sourcemap: true,
		minify: true
    },
});
