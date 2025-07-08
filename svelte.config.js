import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */

const config = {
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // may differ from host to host
      precompress: false,
      strict: false
    }),
    output: {
      bundleStrategy: 'inline'
    },
    inlineStyleThreshold: 9999999
  },
  preprocess: sveltePreprocess({
    sourceMap: true,
    scss: {
      prependData: `@import './src/lib/styling/sass/main.scss';`,
    }
  })
};

export default config;