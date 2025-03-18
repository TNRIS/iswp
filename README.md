Software for the [Interactive Texas State Water Plan](https://texasstatewaterplan.org)

# start
npm run dev

# Tools
using node 22.2.0

## Pre-setup 
1. Download gill-sans font insteuctions in gill-sans/README.md
2. Download a copy of [react-pivot-standalone-4.1.1.min.js](https://github.com/TNRIS/iswp/blob/main/static/react-pivot-standalone-4.1.1.min.js) and place in static folder root.
3. Compile a version of chartist located here. https://github.com/L-Har/chartist (Trying to get this in upstream)
4. Create a local modules folder and place the chartist src and dist in it.
5. Link to library with `npm link chartist`
   You can preview the production build with `npm run preview`.

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
1. Build static site `make build` from the source directory.

## Deploying and building (Must have a s3 bucket or some other static webserver hosting.)
1. run `make deploy_prod`

## Creating cache
How to create cache.

1. Convert non-spatial data (Used to be sqlite files) to JSON
2. gzip then remove .gz files Should be cache.json (But gzipped)
3. upload to s3 bucket,
4. set metadata to Content-Encoding gzip, Content-Type application/json
5. Make publically accessible.

## Prettier Configuration
Prettier config is located in package.json.
prettier-plugin-svelte Svelte for vs code extension has this installed.

## LICENSING
This program is licenced under GPLV2 Please see LICENSE file for details.
This program is distributed with the following programs under separate free licenses. View them for details.

skeleton.css, react-pivot standalone, chartist, overlapping market spiderfier, leaflet utfgrid
https://github.com/dhg/Skeleton
https://github.com/L-Har/react-pivot
https://github.com/davidguttman/react-pivot
https://github.com/chartist-js/chartist
https://github.com/L-Har/chartist
https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet
https://github.com/L-Har/OverlappingMarkerSpiderfier-Leaflet
https://github.com/danzel/Leaflet.utfgrid
https://github.com/L-Har/Leaflet.utfgrid