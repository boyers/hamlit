Hamlit
======

A social network inspired by [PageRank](http://en.wikipedia.org/wiki/PageRank). For more information, visit [www.hamlit.com](https://www.hamlit.com).

## Dependencies

Production:

- [MongoDB](http://www.mongodb.org/)
- [Node.js](http://nodejs.org/)

Development:

- [MongoDB](http://www.mongodb.org/)
- [Node.js](http://nodejs.org/)
- [Grunt](http://gruntjs.com/)
- [Pngcrush](http://pmt.sourceforge.net/pngcrush/)
- [Sass](http://sass-lang.com/)
- [SCSS-lint](https://github.com/causes/scss-lint)
- `sudo npm install -g react-tools grunt-cli`

## How to run

Install the dependencies listed above and make sure MongoDB is running. You can run the server in development or production mode. In production mode, assets are pre-compiled via `grunt`. In development mode, assets are re-generated on every request (except sprites, which are pre-compiled).

Development:

    $ grunt # Only needed if you changed any sprites.
    $ npm start

Production:

    $ grunt # Only needed if you changed any HTML, CSS, SCSS, JavaScript, JSX, or sprites.
    $ NODE_ENV=production DATABASE_URL=... SECRET_KEY=... npm start

## Environment variables

These are the environment variables and their defaults:

    # These are optional.
    PORT=3000
    NODE_ENV=development

    # In production, these are not optional.
    DATABASE_URL=mongodb://localhost/hamlit
    SECRET_KEY=abc123
