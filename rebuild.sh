#!/bin/bash
npm run build
if [[ `git status countries.json --porcelain` ]]; then
  echo 'Changes detected'
  npm version patch -f
  PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g'
  | tr -d '[[:space:]]')
  git commit countries.json -am "$PACKAGE_VERSION"
  git push
fi
