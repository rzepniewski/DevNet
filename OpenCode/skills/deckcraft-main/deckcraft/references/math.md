# Math & Equations

CSS-based math rendering for presentations. Zero external dependencies.

## Inline Math: `.math`

```html
<span class="math">E = mc<sup>2</sup></span>
```

Use `.op` for non-italic operators:

```html
<span class="math">f(x) <span class="op">=</span> ax<sup>2</sup> <span class="op">+</span> bx <span class="op">+</span> c</span>
```

---

## Block Math: `.math-block`

Centered, larger display for key equations.

```html
<div class="math-block">
    E = mc<sup>2</sup>
</div>
```

---

## Fractions: `.math-frac`

```html
<span class="math-frac">
    <span class="numerator">a + b</span>
    <span class="denominator">c</span>
</span>
```

Nested fractions:

```html
<span class="math-frac">
    <span class="numerator">1</span>
    <span class="denominator">1 +
        <span class="math-frac">
            <span class="numerator">1</span>
            <span class="denominator">x</span>
        </span>
    </span>
</span>
```

---

## Square Root: `.math-sqrt`

```html
<span class="math-sqrt">
    <span class="radicand">x + y</span>
</span>
```

Nth root:

```html
<span class="math-sqrt">
    <span class="root-index">3</span>
    <span class="radicand">27</span>
</span>
```

---

## Summation: `.math-sum`

```html
<span class="math-sum">
    <span class="limit-upper">n</span>
    <span class="operator">&Sigma;</span>
    <span class="limit-lower">i=1</span>
</span>
```

---

## Product: `.math-prod`

```html
<span class="math-prod">
    <span class="limit-upper">n</span>
    <span class="operator">&Pi;</span>
    <span class="limit-lower">i=1</span>
</span>
```

---

## Integral: `.math-integral`

```html
<span class="math-integral">
    <span class="limit-upper">b</span>
    <span class="operator">&int;</span>
    <span class="limit-lower">a</span>
</span>
```

---

## Matrix: `.math-matrix`

```html
<div class="math-matrix">
    <div class="matrix-row">
        <span>a</span><span>b</span>
    </div>
    <div class="matrix-row">
        <span>c</span><span>d</span>
    </div>
</div>
```

Determinant (vertical bars):

```html
<div class="math-matrix determinant">
    <div class="matrix-row">
        <span>a</span><span>b</span>
    </div>
    <div class="matrix-row">
        <span>c</span><span>d</span>
    </div>
</div>
```

---

## Parentheses & Brackets

Auto-sizing delimiters:

```html
<span class="math-paren">
    <span class="math-frac">
        <span class="numerator">a</span>
        <span class="denominator">b</span>
    </span>
</span>
```

```html
<span class="math-bracket">x + 1</span>
```

---

## Greek Letters & Symbols

Use HTML entities:

| Entity | Symbol | Name |
|--------|--------|------|
| `&alpha;` | &alpha; | alpha |
| `&beta;` | &beta; | beta |
| `&gamma;` | &gamma; | gamma |
| `&delta;` | &delta; | delta |
| `&theta;` | &theta; | theta |
| `&lambda;` | &lambda; | lambda |
| `&mu;` | &mu; | mu |
| `&pi;` | &pi; | pi |
| `&Sigma;` | &Sigma; | Sigma |
| `&Pi;` | &Pi; | Pi |
| `&infin;` | &infin; | infinity |
| `&int;` | &int; | integral |
| `&part;` | &part; | partial |
| `&nabla;` | &nabla; | nabla |
| `&isin;` | &isin; | element of |
| `&forall;` | &forall; | for all |
| `&exist;` | &exist; | exists |
| `&rarr;` | &rarr; | right arrow |
| `&ne;` | &ne; | not equal |
| `&le;` | &le; | less or equal |
| `&ge;` | &ge; | greater or equal |
| `&times;` | &times; | multiply |
| `&plusmn;` | &plusmn; | plus-minus |
| `&radic;` | &radic; | square root |

---

## KaTeX Integration

If KaTeX is loaded (via CDN or local bundle), use `.katex-eq` for LaTeX rendering:

Inline: `<span class="katex-eq">E = mc^2</span>`

Display: `<span class="katex-eq display">\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}</span>`

---

## Full Examples

### Quadratic Formula

```html
<div class="math-block">
    x =
    <span class="math-frac">
        <span class="numerator">&minus;b &plusmn;
            <span class="math-sqrt">
                <span class="radicand">b<sup>2</sup> &minus; 4ac</span>
            </span>
        </span>
        <span class="denominator">2a</span>
    </span>
</div>
```

### Euler's Identity

```html
<div class="math-block">
    e<sup>i&pi;</sup> + 1 = 0
</div>
```

### Summation with Fraction

```html
<div class="math-block">
    <span class="math-sum">
        <span class="limit-upper">&infin;</span>
        <span class="operator">&Sigma;</span>
        <span class="limit-lower">n=1</span>
    </span>
    <span class="math-frac">
        <span class="numerator">1</span>
        <span class="denominator">n<sup>2</sup></span>
    </span>
    =
    <span class="math-frac">
        <span class="numerator">&pi;<sup>2</sup></span>
        <span class="denominator">6</span>
    </span>
</div>
```
