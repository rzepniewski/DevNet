# Images & Video Components

Requires `components-extra.css`.

## Slide Image

Responsive image with rounded corners and shadow.

```html
<img class="slide-image" src="photo.jpg" alt="Description">
```

### Modifiers

```html
<!-- Fully rounded (circle for square images) -->
<img class="slide-image rounded" src="avatar.jpg" alt="Avatar">

<!-- Thicker border -->
<img class="slide-image bordered" src="photo.jpg" alt="Photo">

<!-- Larger shadow -->
<img class="slide-image shadow-lg" src="hero.jpg" alt="Hero image">

<!-- Combine modifiers -->
<img class="slide-image bordered shadow-lg" src="photo.jpg" alt="Photo">
```

## Image with Caption

```html
<div class="image-figure">
    <img class="slide-image" src="diagram.png" alt="Architecture diagram">
    <span class="image-caption">Figure 1: System architecture overview</span>
</div>
```

## Image Grid

Responsive grid that auto-fits images.

```html
<div class="image-grid">
    <img class="slide-image" src="img1.jpg" alt="Image 1">
    <img class="slide-image" src="img2.jpg" alt="Image 2">
    <img class="slide-image" src="img3.jpg" alt="Image 3">
    <img class="slide-image" src="img4.jpg" alt="Image 4">
</div>
```

Images use `object-fit: cover` at 250px height.

## Full-Bleed Background Image

Use a background image that fills the entire slide with a dark overlay for text readability.

```html
<div class="slide image-bg" style="background-image: url('hero.jpg')">
    <div class="slide-content">
        <h2>Title Over Image</h2>
        <p>Text is readable thanks to the dark overlay.</p>
    </div>
</div>
```

The `::before` pseudo-element adds a 50% black overlay automatically.

## Video Container

Responsive 16:9 video embed wrapper.

```html
<!-- YouTube/Vimeo embed -->
<div class="video-container">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
</div>

<!-- HTML5 video -->
<div class="video-container">
    <video controls>
        <source src="video.mp4" type="video/mp4">
    </video>
</div>
```

### Aspect Ratio Variants

```html
<!-- Square (1:1) -->
<div class="video-container square">
    <iframe src="..."></iframe>
</div>

<!-- Portrait (3:4) -->
<div class="video-container portrait">
    <iframe src="..."></iframe>
</div>
```

## Including in HTML

Add to your presentation `<head>`:

```html
<link rel="stylesheet" href="lib/components-extra.css">
```
