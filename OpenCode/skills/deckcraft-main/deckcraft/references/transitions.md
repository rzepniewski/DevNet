# Slide Transitions

Control how slides animate when navigating between them.

## Configuration

Set the transition type in `Presentation.init()`:

```js
Presentation.init({
    transition: 'fade'  // 'none', 'fade', 'slide', 'zoom'
});
```

Default is `'fade'`.

## Transition Types

| Type | Description |
|------|-------------|
| `none` | Instant show/hide, no animation |
| `fade` | Cross-fade between slides (opacity only, no transform) |
| `slide` | Horizontal slide: next slides enter from right, previous slides enter from left |
| `zoom` | Zoom effect: entering slides scale from 1.2 to 1, exiting slides scale to 0.8 |

## Per-Slide Override

Override the global transition on individual slides with `data-transition`:

```html
<div class="slide" data-transition="zoom">
    <h2>This slide zooms in</h2>
</div>
```

The per-slide transition takes priority over the global setting.

## Changing at Runtime

```js
Presentation.setTransition('slide');
```

This updates the body class and takes effect on the next navigation.

## How It Works

- **Global class**: The body gets a class like `.transition-fade`, `.transition-slide`, etc.
- **Directional transitions** (`slide`, `zoom`): The JS adds `.slide-enter` and `.slide-exit` classes and a `data-transition-direction` attribute (`forward` or `backward`) on the body to control direction.
- **Simple transitions** (`none`, `fade`): Only use the `.active` class swap -- no directional classes needed.
- All transitions use `0.5s cubic-bezier(0.4, 0, 0.2, 1)` timing.

## Examples

### Fade (default)

```js
Presentation.init({
    transition: 'fade'
});
```

Clean cross-dissolve between slides. No movement, just opacity.

### Slide

```js
Presentation.init({
    transition: 'slide'
});
```

Slides move horizontally. Forward navigation: current slide exits left, next slide enters from right. Backward navigation reverses the direction.

### Zoom

```js
Presentation.init({
    transition: 'zoom'
});
```

Slides scale in and out. Forward: exiting slide shrinks (scale 0.8), entering slide grows from enlarged (scale 1.2). Backward reverses the scale direction.

### None (instant)

```js
Presentation.init({
    transition: 'none'
});
```

No animation at all. Slides appear and disappear instantly.

## Notes

- The existing default `--transition-slide` CSS variable (`all 0.5s cubic-bezier(0.4, 0, 0.2, 1)`) is overridden by the transition classes for more specific control.
- Transition classes are preserved when switching themes or profiles.
- Per-slide `data-transition` overrides apply to both entering and exiting that slide.
