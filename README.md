# useScrollTo

Scroll to React elements with custom timing function support.

## Quick start

```bash
npm install use-scroll-to-2
```

Trigger manually:

```jsx
import React from "react";
import { useScrollTo } from "use-scroll-to-2";

function App() {
  const [ref, scroll] = useScrollTo();

  return (
    <div>
      <button onClick={scroll}>Scroll to div</button>
      <div ref={ref}></div>
    </div>
  );
}
```

Trigger on mount:

```jsx
import React from "react";
import { useScrollTo } from "use-scroll-to-2";

function App() {
  const [ref] = useScrollTo({ auto: true });

  return (
    <div>
      <button onClick={scroll}>Scroll to div</button>
      <div ref={ref}></div>
    </div>
  );
}
```

## Configuration

All configuration options are optional.

### `duration` _(optional)_

Scroll duration in milliseconds. Default `480`.

### `delay` _(optional)_

Scroll delay in milliseconds. Default `0`.

### `easing` _(optional)_

An easing function. This expects a function returned by excellent
[bezier-easing](https://www.npmjs.com/package/bezier-easing) library.

For convenience it is re-exported as `bezier` in this library.

```jsx
import { bezier, useScrollTop } from "use-scroll-to-2";

useScrollTop({
  duration: 600,
  easing: bezier(0.42, 0, 0.58, 1),
});
```

Default: `bezier(0.25, 0.1, 0.25, 1)`.

### `auto` _(optional)_

Start scrolling on element mount. Default `false`.

### `offsetTop` _(optional)_

A top offset. This can be either a number, or a function that takes scroll
direction and returns a number. Default: `0`.

```jsx
useScrollTop({
  duration: 600,
  offsetTop: (dir) => (dir === -1 ? 50 : 0), // -1 -> going up, 1 -> down
});
```

### `offsetLeft` _(optional)_

A left offset. This can be either a number, or a function that takes scroll
direction and returns a number. Default: `0`.

```jsx
useScrollTop({
  duration: 600,
  offsetTop: (dir) => (dir === -1 ? 50 : 0), // -1 -> going left, 1 -> right
});
```
