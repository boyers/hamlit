Eigenfeed
=========

A social network inspired by [PageRank](http://en.wikipedia.org/wiki/PageRank). For more information, visit [www.eigenfeed.com](https://www.eigenfeed.com).

## Installation

Dependencies (other than the included NPM packages):

- [Grunt](http://gruntjs.com/)
- [Node.js](http://nodejs.org/)
- [Pngcrush](http://pmt.sourceforge.net/pngcrush/)
- [Ruby](https://www.ruby-lang.org/en/)
- [Sass](http://sass-lang.com/)
- [SCSS-lint](https://github.com/causes/scss-lint)

After installing the above, fetch the remaining dependencies:

    $ npm install

## Run

Development:

    $ grunt # only needed if you changed the sprites
    $ npm start

Production:

    $ grunt # only needed if you changed any HTML, CSS, SCSS, JavaScript, JSX, or sprites
    $ NODE_ENV=production npm start

## Environment variables

These are the environment variables and their defaults:

    PORT=3000
    NODE_ENV=development
