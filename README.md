#start
npm run dev

# Tools
using node 18.16.0

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing
Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:
1. download gill-sans font insteuctions in gill-sans/README.md
2. open main.css search url( then remove old_static
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