'use strict';
import $ from 'jquery';

const DATA_KEY = 'bs.slider';
const EVENT_KEY = `.${DATA_KEY}`;

const Selector = {
  INNER: '.slider-inner',
  DATA_SLIDE: '[data-slide]',
  DATA_DIRECTION: '[data-direction]',
};

const THRESHOLD = 10;
const HOLD_INTERVAL = 100;
const $doc = $(document);
const Direction = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const SlideDirection = {
  PREV: 'prev',
  NEXT: 'next',
};

const ClassName = {
  DRAG_EVENT: 'drag-event'
};


const Event = {
  CLICK: `click${EVENT_KEY}`,
  MOUSEDOWN: `mousedown${EVENT_KEY}`,
  MOUSEUP: `mouseup${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`,
  MOUSEMOVE: `mousemove${EVENT_KEY}`,
};


const getElementFromEvent = (e) => {
  return e.currentTarget;
};

const slide = (e) => {
  e.preventDefault();

  const elem = getElementFromEvent(e);
  const $$ = $(elem);
  const $target = $($$.attr('href'));
  const $inner = $target.find(Selector.INNER);
  const delta = $$.data('slide') === SlideDirection.PREV ? -1 : 1;

  if ($$.data('direction') === Direction.VERTICAL) {

    const height = $inner.height();
    const current = $inner[0].scrollTop;
    const max = $inner[0].scrollHeight;
    $inner[0].scrollTop = Math.max(0, Math.min(max - height, current + delta * height));

    return
  }


  const width = $inner.width();
  const current = $inner[0].scrollLeft;
  const max = $inner[0].scrollWidth;
  $inner[0].scrollLeft = Math.max(0, Math.min(max - width, current + delta * width));
};

$doc.on('click', Selector.DATA_SLIDE, (e) => slide(e));


let isDragging = false;
let isMoving = false;
let clickPrevented = false;
const start = {};
const offset = {};

const down = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const elem = getElementFromEvent(e);

  isDragging = true;
  elem.classList.add(ClassName.DRAG_EVENT);

  start.x = e.pageX - elem.offsetLeft;
  start.y = e.pageY - elem.offsetTop;

  offset.x = elem.scrollLeft;
  offset.y = elem.scrollTop;
};

const up = (e) => {
  isDragging = false;

  if (!isMoving) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  isMoving = false;
  const elem = getElementFromEvent(e);
  elem.classList.remove(ClassName.DRAG_EVENT);
  clickPrevented = true;

  setTimeout(() => {
    clickPrevented = false
  }, HOLD_INTERVAL);
};

const move = (e) => {

  if (!isDragging) {
    return;
  }

  const elem = getElementFromEvent(e);
  const x = e.pageX - elem.offsetLeft;
  const y = e.pageY - elem.offsetTop;

  const diff = {
    x: start.x - x,
    y: start.y - y,
  };


  if (Math.abs(diff.x) < THRESHOLD && Math.abs(diff.y) < THRESHOLD) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();
  isMoving = true;

  const speed = {x: 1, y: 1};
  const walk = {
    x: (x - start.x) * speed.x,
    y: (y - start.y) * speed.y,
  };

  elem.scrollLeft = offset.x - walk.x;
  elem.scrollTop = offset.y - walk.y;
};

const click = (e) => {
  if (clickPrevented) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
};


$doc.on(Event.MOUSEDOWN, Selector.INNER, (e) => down(e));
$doc.on(Event.MOUSELEAVE, Selector.INNER, (e) => up(e));
$doc.on(Event.MOUSEUP, Selector.INNER, (e) => up(e));
$doc.on(Event.MOUSEMOVE, Selector.INNER, (e) => move(e));
$doc.on(Event.CLICK, Selector.INNER, (e) => click(e));

