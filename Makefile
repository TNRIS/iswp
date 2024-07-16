default: static_site

# For internal TWDB use only. This completely rebuilds the local source and deploys it to aws.
# Please be sure to pull from git before running, and any local modifications are intentional.
deploy_prod: static_site s3_deploy
deploy_prod_test: static_site s3_deploy_test
deploy_staging: static_site s3_deploy_staging

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
s3_deploy_staging:
	aws s3 cp build s3://iswp-bucket-staging --recursive --region=us-east-1