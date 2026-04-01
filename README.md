[![GitHub Tag](https://img.shields.io/github/v/tag/vielhuber/lanimate)](https://github.com/vielhuber/lanimate/tags)
[![Code Style](https://img.shields.io/badge/code_style-psr--12-ff69b4.svg)](https://www.php-fig.org/psr/psr-12/)
[![License](https://img.shields.io/github/license/vielhuber/lanimate)](https://github.com/vielhuber/lanimate/blob/main/LICENSE.md)
[![Last Commit](https://img.shields.io/github/last-commit/vielhuber/lanimate)](https://github.com/vielhuber/lanimate/commits)
[![node version](https://img.shields.io/node/v/lanimate)](https://www.npmjs.com/package/lanimate)
[![npm Downloads](https://img.shields.io/npm/dt/lanimate)](https://www.npmjs.com/package/lanimate)

# 🥤 lanimate 🥤

lanimate is a small library that animates appearing dom elements.

## installation

use it as a module:

```
npm install lanimate
```

```js
import Lanimate from 'lanimate';
```

or as a ready-to-go bundle:

```html
<script src="lanimate.min.js"></script>
```

## usage

```js
const lanimate = new Lanimate();
lanimate.init();
```

```html
<h2
    data-lanimate="fade|scrollX|scrollY|scale|rotate|rotate3d|skew"
    data-lanimate-speed="3000"
    data-lanimate-delay="1500"
    data-lanimate-split="none|char|word"
>
    Title
</h2>
```

if you want to prevent fouc, add this css:

```css
[data-lanimate] {
    opacity: 0;
}
```
