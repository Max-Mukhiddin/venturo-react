#!/bin/bash

#### PRODUCTION

# git reset --hard
# git checkout main
# git pull origin main


npm i yarn -g 
yarn global add serve
yarn
yarn run build
pm2 start "yarn run start:prod" --name=VENTURO-REACT




# DEVELOPMENT
# git reset --hard
# git checkout develop
# git pull origin develop
# yarn
# pm2 start "yarn run start:dev" --name=VENTURO