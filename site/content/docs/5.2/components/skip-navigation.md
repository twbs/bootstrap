---
layout: docs
title: Skip navigation
description: Use skip navigation for your keyboard users
group: components
toc: true
added: "5.3"
---

## Overview

Skip navigation can be used for keyboard users in order to skip some items to access more rapidly to the main content of a page.
It tends to be used as the first component a user can encounter while navigating to a website after the page is loaded so that the menus can be skipped.

It is possible thanks to our `.visually-hidden-focusable` and `.overflow-hidden` utilities.

## Basic example

{{< example >}}
<div class="visually-hidden-focusable overflow-hidden">
  <div class="container-xl">
    <a class="d-inline-flex p-2 m-1" href="#content1">Skip to content 1</a>
    <a class="d-none d-md-inline-flex p-2 m-1" href="#content2">Skip to content 2</a>
  </div>
</div>
<div class="py-2 mb-5 text-center">
  <h1 class="display-5 fw-bold">Skip navigation</h1>
  <div class="col-10 mx-auto">
    <p class="lead mb-4">Click outside this example and then press Tab key multiple time. You'll see our Skip navigation component appears that will get focused and then that will allow you to skip this entire hero section to go either to the first or second content.</p>
    <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
      <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Primary button</button>
      <button type="button" class="btn btn-outline-secondary btn-lg px-4">Secondary</button>
    </div>
  </div>
</div>
<div id="content1" class="py-2 mb-5 text-center">
  <h1 class="display-5 fw-bold">Content 1</h1>
  <div class="col-10 mx-auto">
    <p class="lead mb-4">Content 1 description.</p>
    <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
      <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Primary button</button>
      <button type="button" class="btn btn-outline-secondary btn-lg px-4">Secondary</button>
    </div>
  </div>
</div>
<div id="content2" class="py-2 mb-5 text-center">
  <h1 class="display-5 fw-bold">Content 2</h1>
  <div class="col-10 mx-auto">
    <p class="lead mb-4">Content 2 description.</p>
    <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
      <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Primary button</button>
      <button type="button" class="btn btn-outline-secondary btn-lg px-4">Secondary</button>
    </div>
  </div>
</div>
{{< /example >}}