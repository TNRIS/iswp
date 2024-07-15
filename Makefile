default: static_site

# For internal TWDB use only.
deploy_prod: static_site s3_deploy
deploy_prod_test: static_site s3_deploy_test


static_site: css
	npm run build
css:
	sass ./src/lib/sass/main.scss ./src/lib/sass/main.css
	cp ./src/lib/sass/main.css ./static/css/main.css
	cp ./src/lib/sass/main.css.map ./static/css/main.css.map

# For internal TWDB use only.
s3_deploy_test:
	aws s3 cp build s3://iswp-bucket --dryrun --recursive
s3_deploy:
	aws s3 cp build s3://iswp-bucket --recursive --region=us-east-1