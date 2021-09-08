#!/usr/bin/env sh

if test "$BUNDLING" != true;then
  npx lerna run build
fi
