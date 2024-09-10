import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';

export default {
    kit: {
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: 'build',
            assets: 'build',
            fallback: 'index.html', // may differ from host to host
            precompress: false,
            strict: true
        })
    },
    preprocess: sveltePreprocess()
};
