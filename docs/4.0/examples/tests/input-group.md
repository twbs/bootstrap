---
layout: default
title: Test - Input groups
sizes:
  - "input-group-sm"
  - ""
  - "input-group-lg"
---

<style>
main { padding: 2rem; }
.input-group { margin-bottom: .5rem; }
.row { margin-top: 1rem; margin-bottom: 1.5rem; }
hr { margin-bottom: 1.5rem; }
h3, p { margin-bottom: 0; }
h2 + p { max-width: var(--breakpoint-md); }
</style>

## Input groups
Test file for small, default, and large versions of each **supported** combination of inputs, custom controls text add-ons, buttons, and validation styles. Not every combination or form control is supported.

---

### Multiple inputs

<div class="row">
  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <input type="text" class="form-control">
      <input type="text" class="form-control">
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <input type="text" class="form-control">
      <input type="text" class="form-control">
      <input type="text" class="form-control">
    </div>
    {% endfor %}
  </div>
</div>

---

### Text: Append, prepend, both

<div class="row">
  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <span class="input-group-text">@</span>
      </div>
      <input type="text" class="form-control" placeholder="Username">
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <input type="text" class="form-control" placeholder="Recipient's username">
      <div class="input-group-append">
        <span class="input-group-text">@example.com</span>
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <input type="text" class="form-control">
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
    </div>
    {% endfor %}
  </div>
</div>

---

### Multiple text

<div class="row">
  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
      </div>
      <input type="text" class="form-control">
      <div class="input-group-append">
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
      </div>
      <input type="text" class="form-control">
      <input type="text" class="form-control">
      <div class="input-group-append">
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
        <span class="input-group-text">Text</span>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

---

### Buttons

<div class="row">
  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <input type="text" class="form-control" placeholder="">
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <input type="text" class="form-control" placeholder="">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <input type="text" class="form-control" placeholder="">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

---

### Multiple buttons

<div class="row">
  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <input type="text" class="form-control">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <input type="text" class="form-control">
      <input type="text" class="form-control">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

---

### Dropdown buttons

<div class="row">
  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
      <input type="text" class="form-control">
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <input type="text" class="form-control">
      <div class="input-group-append">
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
      <input type="text" class="form-control">
      <div class="input-group-append">
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<div class="row">
  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button type="button" class="btn btn-outline-secondary">1</button>
        <button type="button" class="btn btn-outline-secondary">2</button>
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
      <input type="text" class="form-control">
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <input type="text" class="form-control">
      <div class="input-group-append">
        <button type="button" class="btn btn-outline-secondary">1</button>
        <button type="button" class="btn btn-outline-secondary">2</button>
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="col-md">
    {% for size in page.sizes %}
    <div class="input-group {{ size }}">
      <div class="input-group-prepend">
        <button type="button" class="btn btn-outline-secondary">1</button>
        <button type="button" class="btn btn-outline-secondary">2</button>
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
      <input type="text" class="form-control">
      <div class="input-group-append">
        <button type="button" class="btn btn-outline-secondary">1</button>
        <button type="button" class="btn btn-outline-secondary">2</button>
        <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">Drop</button>
        <div class="dropdown-menu"></div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

---

### Custom form controls
<p class="text-danger">Sizes are not supported on custom selects or custom files.</p>

<div class="row">
  <div class="col-md">
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <select class="custom-select">
        <option selected>Custom select</option>
      </select>
    </div>
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <div class="custom-file">
        <input type="file" class="custom-file-input" id="customFile">
        <label class="custom-file-label" for="customFile">Choose file</label>
      </div>
    </div>
  </div>

  <div class="col-md">
    <div class="input-group">
      <select class="custom-select">
        <option selected>Custom select</option>
      </select>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
    </div>
    <div class="input-group">
      <div class="custom-file">
        <input type="file" class="custom-file-input" id="customFile">
        <label class="custom-file-label" for="customFile">Choose file</label>
      </div>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
    </div>
  </div>

  <div class="col-md">
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <select class="custom-select">
        <option selected>Custom select</option>
      </select>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <div class="custom-file">
        <input type="file" class="custom-file-input" id="customFile">
        <label class="custom-file-label" for="customFile">Choose file</label>
      </div>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
    </div>
  </div>
</div>

---

### Validation
<span class="text-danger">Due to their markup, custom file inputs cannot support validation in an input group.</span>

<div class="row">
  <div class="col-md">
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Text</span>
      </div>
      <input type="text" class="form-control is-invalid">
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <input type="text" class="form-control is-invalid">
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <select class="custom-select is-invalid">
        <option selected>Custom select</option>
      </select>
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <div class="custom-file">
        <input type="file" class="custom-file-input is-invalid" id="customFile">
        <label class="custom-file-label" for="customFile">Choose file</label>
      </div>
    </div>
  </div>

  <div class="col-md">
    <div class="input-group">
      <input type="text" class="form-control is-invalid">
      <div class="input-group-append">
        <span class="input-group-text">Text</span>
      </div>
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <input type="text" class="form-control is-invalid">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <select class="custom-select is-invalid">
        <option selected>Custom select</option>
      </select>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <div class="custom-file">
        <input type="file" class="custom-file-input is-invalid" id="customFile">
        <label class="custom-file-label" for="customFile">Choose file</label>
      </div>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
    </div>
  </div>

  <div class="col-md">
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Text</span>
      </div>
      <input type="text" class="form-control is-invalid">
      <div class="input-group-append">
        <span class="input-group-text">Text</span>
      </div>
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <input type="text" class="form-control is-invalid">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Btn</button>
      </div>
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <select class="custom-select is-invalid">
        <option selected>Custom select</option>
      </select>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
      <div class="invalid-feedback">
        Example invalid feedback text
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Text</span></div>
      <div class="custom-file">
        <input type="file" class="custom-file-input is-invalid" id="customFile">
        <label class="custom-file-label" for="customFile">Choose file</label>
      </div>
      <div class="input-group-append"><span class="input-group-text">Text</span></div>
    </div>
  </div>
</div>
