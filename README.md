# reefbreak.js

A wavy animation engine powered by SVG filters. Zero dependencies, works in every
modern browser.

## Install

```sh
npm install reefbreak
```

## Usage

Add the `data-reefbreak` attribute to anything you want to wave:

```html
<h1 data-reefbreak>reefbreak.js</h1>
```

Then instantiate:

```js
import ReefBreak from 'reefbreak';

new ReefBreak({
  target: '[data-reefbreak]',
  intensity: 1,
  speed: 1,
  animate: true,
});
```

### Via a `<script>` tag (CDN)

The UMD build exposes a global `reefbreak`:

```html
<script src="https://unpkg.com/reefbreak"></script>
<script>
  new reefbreak({ intensity: 0.5, speed: 0.333 });
</script>
```

## Options

| Option                 | Type      | Default              | Description                                                        |
| ---------------------- | --------- | -------------------- | ------------------------------------------------------------------ |
| `target`               | `string`  | `'[data-reefbreak]'` | CSS selector for the elements to apply the effect to.              |
| `intensity`            | `number`  | `1`                  | Strength of the wave (blur, noise frequency and displacement).     |
| `speed`                | `number`  | `1`                  | Animation speed multiplier.                                        |
| `animate`              | `boolean` | `true`               | Animate the effect. Set `false` for a static wave.                 |
| `respectReducedMotion` | `boolean` | `true`               | Skip the animation when the user has `prefers-reduced-motion: reduce`. |

## Cleanup

Each instance can be torn down — this stops the animation loop, removes the filter
from the target elements, and removes the injected SVG. Useful in single-page apps
and component frameworks:

```js
const wave = new ReefBreak();
// ...later
wave.destroy();
```

## License

MIT © Jimmy Richardson
