// Wrapper for the slide container and indicators
.carousel {
  position: relative;
}

.carousel-inner {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-item {
  position: relative;
  display: none;
  align-items: center;
  width: 100%;
  @include transition($carousel-transition);
  backface-visibility: hidden;
  perspective: 1000px;
}

.carousel-item.active,
.carousel-item-next,
.carousel-item-prev {
  display: block;
}

.carousel-item-next,
.carousel-item-prev {
  position: absolute;
  top: 0;
}

// CSS3 transforms when supported by the browser
.carousel-item-next.carousel-item-left,
.carousel-item-prev.carousel-item-right {
  transform: translateX(0);

  @supports (transform-style: preserve-3d) {
    transform: translate3d(0, 0, 0);
  }
}

.carousel-item-next,
.active.carousel-item-right {
  transform: translateX(100%);

  @supports (transform-style: preserve-3d) {
    transform: translate3d(100%, 0, 0);
  }
}

.carousel-item-prev,
.active.carousel-item-left {
  transform: translateX(-100%);

  @supports (transform-style: preserve-3d) {
    transform: translate3d(-100%, 0, 0);
  }
}


//
// Left/right controls for nav
//

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 0;
  bottom: 0;
  // Use flex for alignment (1-3)
  display: flex; // 1. allow flex styles
  align-items: center; // 2. vertically center contents
  justify-content: center; // 3. horizontally center contents
  width: $carousel-control-width;
  color: $carousel-control-color;
  text-align: center;
  opacity: $carousel-control-opacity;
  // We can't have a transition here because WebKit cancels the carousel
  // animation if you trip this while in the middle of another animation.

  // Hover/focus state
  @include hover-focus {
    color: $carousel-control-color;
    text-decoration: none;
    outline: 0;
    opacity: .9;
  }
}
.carousel-control-prev {
  left: 0;
  @if $enable-gradients {
    background: linear-gradient(90deg, rgba(0, 0, 0, .25), rgba(0, 0, 0, .001));
  }
}
.carousel-control-next {
  right: 0;
  @if $enable-gradients {
    background: linear-gradient(270deg, rgba(0, 0, 0, .25), rgba(0, 0, 0, .001));
  }
}

// Icons for within
.carousel-control-prev-icon,
.carousel-control-next-icon {
  display: inline-block;
  width: $carousel-control-icon-width;
  height: $carousel-control-icon-width;
  background: transparent no-repeat center center;
  background-size: 100% 100%;
}
.carousel-control-prev-icon {
  background-image: $carousel-control-prev-icon-bg;
}
.carousel-control-next-icon {
  background-image: $carousel-control-next-icon-bg;
}


// Optional indicator pips
//
// Add an ordered list with the following class and add a list item for each
// slide your carousel holds.

.carousel-indicators {
  position: absolute;
  right: 0;
  bottom: 10px;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  padding-left: 0; // override <ol> default
  // Use the .carousel-control's width as margin so we don't overlay those
  margin-right: $carousel-control-width;
  margin-left: $carousel-control-width;
  list-style: none;

  li {
    position: relative;
    flex: 0 1 auto;
    width: $carousel-indicator-width;
    height: $carousel-indicator-height;
    margin-right: $carousel-indicator-spacer;
    margin-left: $carousel-indicator-spacer;
    text-indent: -999px;
    background-color: rgba($carousel-indicator-active-bg, .5);

    // Use pseudo classes to increase the hit area by 10px on top and bottom.
    &::before {
      position: absolute;
      top: -10px;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 10px;
      content: "";
    }
    &::after {
      position: absolute;
      bottom: -10px;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 10px;
      content: "";
    }
  }

  .active {
    background-color: $carousel-indicator-active-bg;
  }
}


// Optional captions
//
//

.carousel-caption {
  position: absolute;
  right: ((100% - $carousel-caption-width) / 2);
  bottom: 20px;
  left: ((100% - $carousel-caption-width) / 2);
  z-index: 10;
  padding-top: 20px;
  padding-bottom: 20px;
  color: $carousel-caption-color;
  text-align: center;
}
