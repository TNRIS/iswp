default: deploy_prod_test

deploy_prod_test: static_site s3_deploy_test

deploy_prod: static_site s3_deploy

static_site: css
	npm run build

css:
	sass ./src/lib/sass/main.scss ./src/lib/sass/main.css
	cp ./src/lib/sass/main.css ./static/css/main.css
	cp ./src/lib/sass/main.css.map ./static/css/main.css.map

s3_deploy_test:
	aws s3 cp build s3://iswp-bucket --dryrun --recursive

s3_deploy:
	aws s3 cp build s3://iswp-bucket --recursive --region=us-east-1