Eigenfeed
=========

A social network inspired by [PageRank](http://en.wikipedia.org/wiki/PageRank). For more information, visit [www.eigenfeed.com](https://www.eigenfeed.com).

## Installation

Dependencies (other than the included NPM packages):

- [Grunt](http://gruntjs.com/)
- [Node.js](http://nodejs.org/)
- [Pngcrush](http://pmt.sourceforge.net/pngcrush/)
- [PostgreSQL](http://www.postgresql.org/)
- [Ruby](https://www.ruby-lang.org/en/)
- [Sass](http://sass-lang.com/)
- [SCSS-lint](https://github.com/causes/scss-lint)

After installing the above, fetch the remaining dependencies:

    $ npm install

Finally, fire up PostgreSQL and create the database:

    $ node tasks/dbcreate.js

## Run

Development:

    $ npm start

Production:

    $ grunt
    $ NODE_ENV=production npm start

## Environment variables

These are the environment variables and their defaults:

    PORT=3000
    NODE_ENV=development
    DATABASE_URL=postgres://stephan@localhost/eigenfeed
    DATABASE_GLOBAL_URL=postgres://stephan@localhost/postgres
