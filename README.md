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
    data-lanimate="fade|scrollX|scrollY|scale|rotate"
    data-lanimate-speed="3000"
    data-lanimate-delay="1500"
    data-lanimate-split="none|char|word"
>
    Title
</h2>
```
