css:
	sass ./src/lib/sass/main.scss ./src/lib/sass/main.css
	cp ./src/lib/sass/main.css ./static/css/main.css
	cp ./src/lib/sass/main.css.map ./static/css/main.css.map
static_site: css
	npm run build