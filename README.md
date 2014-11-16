Hamlit
======

A social network inspired by [PageRank](http://en.wikipedia.org/wiki/PageRank). For more information, visit [www.hamlit.com](https://www.hamlit.com).

## Dependencies

Production:

- [Node.js](http://nodejs.org/)

Development:

- [Node.js](http://nodejs.org/)
- [Grunt](http://gruntjs.com/)
- [Pngcrush](http://pmt.sourceforge.net/pngcrush/)
- [Ruby](https://www.ruby-lang.org/en/)
- [Sass](http://sass-lang.com/)
- [SCSS-lint](https://github.com/causes/scss-lint)
- `sudo npm install -g react-tools grunt-cli`

## Deployment

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
