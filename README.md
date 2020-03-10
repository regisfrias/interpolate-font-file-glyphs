# Interpolate font file glyphs

Proof of concept of interpolating points between two font files.

## Installation

I'm using Yarn.

```
yarn
```

## Start Dev Server

```
yarn start
```

## Build Prod Version

```
yarn run build
```

## Explanation

Follow through the `index.js` file comments, but here is an overview:

1. Load two fonts: bold (base) and light as `ArrayBuffers`.
2. Parse the ArrayBuffers with `Typr.parse()` to get font objects.
3. Trigger the drawing function, which will print things on screen.
4. Set canvas width to match sourceTextBox (what we really want is to replace the original HTML text with the canvas).
5. Lay out text based on the text box.
6. Loop through each line of laid out text.
  a. Loop through each glyph on each line.
  b. Loop through each coordinate of each glyph.
  c. For each coordinate multiply the amount of thickness and the diff between each font weight.


Bootstrapped with:

# Webpack Frontend Starterkit

[![Dependabot badge](https://flat.badgen.net/dependabot/wbkd/webpack-starter?icon=dependabot)](https://dependabot.com/)

A lightweight foundation for your next webpack based frontend project.


### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### Features:

* ES6 Support via [babel](https://babeljs.io/) (v7)
* SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
* Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
