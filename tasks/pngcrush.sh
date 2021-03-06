#!/bin/sh

# pngcrush a directory given as the first command line argument.
# Note: This modifies the original files.

for png in `find $1 -name "*.png"`;
do
  echo "crushing $png"
  pngcrush -brute "$png" temp.png
  mv -f temp.png $png
done;
