#start
npm run dev

# Tools
using node 18.16.0

## Developing
Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:
npm package

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:
1. download gill-sans font insteuctions in gill-sans/README.md
2. Download a copy of [react-pivot-standalone-4.1.1.min.js][https://github.com/TNRIS/iswp/blob/main/static/react-pivot-standalone-4.1.1.min.js] and place in static folder root.
```bash
npm run build
```

3. compile main.scss `sass main.scss main.css` (Install sass first `npm install -g sass`) Then move it into static/css
Designed to be compiled manually due to sveltekit not allowing prerender = true on dynamic routes AKA [slug] pages. Resulting in a split second where the css is not loaded causing a flicker effect.
4. Compile a version of chartist located here. https://github.com/L-Har/chartist (Trying to get this in upstream)
5. Make sure to pull from https://github.com/chartist-js/chartist and merge new changes if this still isn't upstream.
6. Place dist folder in lib/chartist folder and place package.json from the repo here.
7. Create a local modules folder and place src and dist in it. 
8. link to library with `npm link src/lib/chartist`
You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


## Creating cache
How to create cache.
1. Convert non-spatial data (Used to be sqlite files) to JSON
2. gzip then remove .gz files Should be cache.json (But gzipped)
3. upload to s3 bucket, 
4. set metadata to Content-Encoding	gzip, Content-Type application/json
5. Make publically accessible.

## Creating db check file
1. Run getmdata.js file
2. upload checkfile2023.json to https://tnris-droc.s3.amazonaws.com/iswp/

## Prettier Configuration
Prettier config is located in package.json.
prettier-plugin-svelte Svelte for vs code extension has this installed.