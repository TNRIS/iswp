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