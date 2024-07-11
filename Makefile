css:
	sass ./src/lib/sass/main.scss ./static/css/main.css

static_site: css
	npm run build