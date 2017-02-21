# scroll-scout

![Node](https://img.shields.io/node/v/scroll-scout.svg?style=flat-square)
[![NPM](https://img.shields.io/npm/v/scroll-scout.svg?style=flat-square)](https://www.npmjs.com/package/scroll-scout)
[![Travis](https://img.shields.io/travis/flndr/scroll-scout/master.svg?style=flat-square)](https://travis-ci.org/flndr/scroll-scout)
[![David](https://img.shields.io/david/flndr/scroll-scout.svg?style=flat-square)](https://david-dm.org/flndr/scroll-scout)
[![Coverage Status](https://img.shields.io/coveralls/flndr/scroll-scout.svg?style=flat-square)](https://coveralls.io/github/flndr/scroll-scout)

> scroll-scout

### Usage

```js
import scrollScout from 'scroll-scout';

```

### Installation

Install via [yarn](https://github.com/yarnpkg/yarn)

	yarn add scroll-scout (--dev)

or npm

	npm install scroll-scout (--save-dev)


### configuration

You can pass in extra options as a configuration object (➕ required, ➖ optional, ✏️ default).

```js
import scrollScout from 'scroll-scout';

```

➖ **property** ( type ) ` ✏️ default `
<br/> 📝 description
<br/> ❗️ warning
<br/> ℹ️ info
<br/> 💡 example

### methods

#### #name

```js
scrollScout

```

### Examples

See [`example`](example/script.js) folder or the [runkit](https://runkit.com/flndr/scroll-scout) example.

### Builds

If you don't use a package manager, you can [access `scroll-scout` via unpkg (CDN)](https://unpkg.com/scroll-scout/), download the source, or point your package manager to the url.

`scroll-scout` is compiled as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules & [ES2015 modules](http://www.2ality.com/2014/0
  -9/es6-modules-final.html) for bundlers that support the `jsnext:main` or `module` field in package.json (Rollup, Webpack 2)

The `scroll-scout` package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://unpkg.com/scroll-scout/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. You can drop a UMD build as a [`<script>` tag](https://unpkg.com/scroll-scout) on your page. The UMD builds make `scroll-scout` available as a `window.scrollScout` global variable.

### License

The code is available under the [MIT](LICENSE) license.

### Contributing

We are open to contributions, see [CONTRIBUTING.md](CONTRIBUTING.md) for more info.

### Misc

This module was created using [generator-module-boilerplate](https://github.com/duivvv/generator-module-boilerplate).
