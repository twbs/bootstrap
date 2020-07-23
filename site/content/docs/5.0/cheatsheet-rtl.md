---
layout: docs
title: Cheatsheet
direction: rtl
description: Comprehensive list of Bootstrap components.
group: cheatsheet
aliases: "/cheatsheet/"
toc: true
---

[This cheatsheet is also available in left-to-right]({{< docsref "/cheatsheet" >}}).


## Contents

### Typography

{{< example show_markup="false" >}}
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
{{< /example >}}

{{< example show_markup="false" >}}
<p class="display-1">Display 1</p>
<p class="display-2">Display 2</p>
<p class="display-3 ">Display 3</p>
<p class="display-4">Display 4</p>
<p class="display-5">Display 5</p>
<p class="display-6">Display 6</p>
{{< /example >}}

{{< example show_markup="false" >}}
<p class="lead">
  Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.
</p>
{{< /example >}}

{{< example show_markup="false" >}}
<p>You can use the mark tag to <mark>highlight</mark> text.</p>
<p><del>This line of text is meant to be treated as deleted text.</del></p>
<p><s>This line of text is meant to be treated as no longer accurate.</s></p>
<p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
<p><u>This line of text will render as underlined</u></p>
<p><small>This line of text is meant to be treated as fine print.</small></p>
<p><strong>This line rendered as bold text.</strong></p>
<p><em>This line rendered as italicized text.</em></p>
{{< /example >}}

{{< example show_markup="false" >}}
<blockquote class="blockquote">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote>
{{< /example >}}

{{< example show_markup="false" >}}
<ul class="list-unstyled">
  <li>Lorem ipsum dolor sit amet</li>
  <li>Consectetur adipiscing elit</li>
  <li>Integer molestie lorem at massa</li>
  <li>Facilisis in pretium nisl aliquet</li>
  <li>Nulla volutpat aliquam velit
    <ul>
      <li>Phasellus iaculis neque</li>
      <li>Purus sodales ultricies</li>
      <li>Vestibulum laoreet porttitor sem</li>
      <li>Ac tristique libero volutpat at</li>
    </ul>
  </li>
  <li>Faucibus porta lacus fringilla vel</li>
  <li>Aenean sit amet erat nunc</li>
  <li>Eget porttitor lorem</li>
</ul>
{{< /example >}}

{{< example show_markup="false" >}}
<ul class="list-inline">
  <li class="list-inline-item">Lorem ipsum</li>
  <li class="list-inline-item">Phasellus iaculis</li>
  <li class="list-inline-item">Nulla volutpat</li>
</ul>
{{< /example >}}

### Images

{{< example show_markup="false" >}}
{{< placeholder width="100%" height="250" class="bd-placeholder-img-lg img-fluid" text="Responsive image" >}}
{{< /example >}}

{{< example show_markup="false" >}}
{{< placeholder width="200" height="200" class="img-thumbnail" title="A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera" >}}
{{< /example >}}

### Tables

{{< example show_markup="false" >}}
<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

{{< example show_markup="false" >}}
<table class="table table-dark table-borderless">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

{{< example show_markup="false" >}}
<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">Class</th>
      <th scope="col">Heading</th>
      <th scope="col">Heading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Default</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    {{< table.inline >}}
    {{- range (index $.Site.Data "theme-colors") }}
      <tr class="table-{{ .name }}">
        <th scope="row">{{ .name | title }}</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
    {{- end -}}
    {{< /table.inline >}}
  </tbody>
</table>
{{< /example >}}

{{< example show_markup="false" >}}
<table class="table table-sm table-bordered">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

### Figures

{{< example show_markup="false" >}}
<figure class="figure">
  {{< placeholder width="400" height="300" class="figure-img img-fluid rounded" >}}
  <figcaption class="figure-caption">A caption for the above image.</figcaption>
</figure>
{{< /example >}}

## Forms

### Overview

{{< example show_markup="false" >}}
<form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <fieldset class="mb-3">
    <legend>Radios buttons</legend>
    <div class="form-check">
      <input type="radio" name="radios" class="form-check-input" id="exampleRadio1">
      <label class="form-check-label" for="exampleRadio1">Default radio</label>
    </div>
    <div class="mb-3 form-check">
      <input type="radio" name="radios" class="form-check-input" id="exampleRadio2">
      <label class="form-check-label" for="exampleRadio2">Another radio</label>
    </div>
  </fieldset>
  <div class="mb-3 form-file">
    <input type="file" class="form-file-input" id="customFile">
    <label class="form-file-label" for="customFile">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
  <div class="mb-3 form-check form-switch">
    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
    <label class="form-check-label" for="flexSwitchCheckChecked">Checked switch checkbox input</label>
  </div>
  <div class="mb-3">
    <label for="customRange3" class="form-label">Example range</label>
    <input type="range" class="form-range" min="0" max="5" step="0.5" id="customRange3">
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
{{< /example >}}

### Disabled forms

{{< example show_markup="false" >}}
<form>
  <fieldset disabled aria-label="Disabled fieldset example">
    <div class="mb-3">
      <label for="disabledTextInput" class="form-label">Disabled input</label>
      <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
    </div>
    <div class="mb-3">
      <label for="disabledSelect" class="form-label">Disabled select menu</label>
      <select id="disabledSelect" class="form-select">
        <option>Disabled select</option>
      </select>
    </div>
    <div class="mb-3">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="disabledFieldsetCheck" disabled>
        <label class="form-check-label" for="disabledFieldsetCheck">
          Can't check this
        </label>
      </div>
    </div>
    <fieldset class="mb-3">
      <legend>Disabled radios buttons</legend>
      <div class="form-check">
        <input type="radio" name="radios" class="form-check-input" id="disabledRadio1" disabled>
        <label class="form-check-label" for="disabledRadio1">Disabled radio</label>
      </div>
      <div class="mb-3 form-check">
        <input type="radio" name="radios" class="form-check-input" id="disabledRadio2" disabled>
        <label class="form-check-label" for="disabledRadio2">Another radio</label>
      </div>
    </fieldset>
    <div class="mb-3 form-file">
      <input type="file" class="form-file-input" id="disabledCustomFile">
      <label class="form-file-label" for="disabledCustomFile">
        <span class="form-file-text">Choose file...</span>
        <span class="form-file-button">Browse</span>
      </label>
    </div>
    <div class="mb-3 form-check form-switch">
      <input class="form-check-input" type="checkbox" id="disabledSwitchCheckChecked" checked disabled>
      <label class="form-check-label" for="disabledSwitchCheckChecked">Disabled checked switch checkbox input</label>
    </div>
    <div class="mb-3">
      <label for="disabledRange" class="form-label">Disabled range</label>
      <input type="range" class="form-range" min="0" max="5" step="0.5" id="disabledRange">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </fieldset>
</form>
{{< /example >}}

### Sizing

{{< example show_markup="false" >}}
<div class="mb-3">
  <input class="form-control form-control-lg" type="text" placeholder=".form-control-lg" aria-label=".form-control-lg example">
</div>
<div class="mb-3">
  <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>
<div class="mb-3">
  <div class="form-file form-file-lg mb-3">
    <input type="file" class="form-file-input" id="customFileLg">
    <label class="form-file-label" for="customFileLg">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
</div>
{{< /example >}}

{{< example show_markup="false" >}}
<div class="mb-3">
  <input class="form-control form-control-sm" type="text" placeholder=".form-control-sm" aria-label=".form-control-sm example">
</div>
<div class="mb-3">
  <select class="form-select form-select-sm" aria-label=".form-select-sm example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>
<div class="mb-3">
  <div class="form-file form-file-sm">
    <input type="file" class="form-file-input" id="customFileSm">
    <label class="form-file-label" for="customFileSm">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
</div>
{{< /example >}}

### Input group

{{< example show_markup="false" >}}
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
</div>
<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">
  <span class="input-group-text" id="basic-addon2">@example.com</span>
</div>
<label for="basic-url" class="form-label">Your vanity URL</label>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon3">https://example.com/users/</span>
  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
</div>
<div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
  <span class="input-group-text">.00</span>
</div>
<div class="input-group">
  <span class="input-group-text">With textarea</span>
  <textarea class="form-control" aria-label="With textarea"></textarea>
</div>
{{< /example >}}

### Validation

{{< example show_markup="false" >}}
<form class="row g-3">
  <div class="col-md-4">
    <label for="validationServer01" class="form-label">First name</label>
    <input type="text" class="form-control is-valid" id="validationServer01" value="Mark" required>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
  <div class="col-md-4">
    <label for="validationServer02" class="form-label">Last name</label>
    <input type="text" class="form-control is-valid" id="validationServer02" value="Otto" required>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
  <div class="col-md-4">
    <label for="validationServerUsername" class="form-label">Username</label>
    <div class="input-group">
      <span class="input-group-text" id="inputGroupPrepend3">@</span>
      <input type="text" class="form-control is-invalid" id="validationServerUsername" aria-describedby="inputGroupPrepend3" required>
      <div class="invalid-feedback">
        Please choose a username.
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <label for="validationServer03" class="form-label">City</label>
    <input type="text" class="form-control is-invalid" id="validationServer03" required>
    <div class="invalid-feedback">
      Please provide a valid city.
    </div>
  </div>
  <div class="col-md-3">
    <label for="validationServer04" class="form-label">State</label>
    <select class="form-select is-invalid" id="validationServer04" required>
      <option selected disabled value="">Choose...</option>
      <option>...</option>
    </select>
    <div class="invalid-feedback">
      Please select a valid state.
    </div>
  </div>
  <div class="col-md-3">
    <label for="validationServer05" class="form-label">Zip</label>
    <input type="text" class="form-control is-invalid" id="validationServer05" required>
    <div class="invalid-feedback">
      Please provide a valid zip.
    </div>
  </div>
  <div class="col-12">
    <div class="form-check">
      <input class="form-check-input is-invalid" type="checkbox" value="" id="invalidCheck3" required>
      <label class="form-check-label" for="invalidCheck3">
        Agree to terms and conditions
      </label>
      <div class="invalid-feedback">
        You must agree before submitting.
      </div>
    </div>
  </div>
  <div class="col-12">
    <button class="btn btn-primary" type="submit">Submit form</button>
  </div>
</form>
{{< /example >}}

## Components

### Alerts

{{< example show_markup="false" >}}
{{< alerts.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<div class="alert alert-{{ .name }} alert-dismissible fade show" role="alert">
  A simple {{ .name }} alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>{{ end -}}
{{< /alerts.inline >}}
{{< /example >}}

{{< example show_markup="false" >}}
<div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Well done!</h4>
  <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
  <hr>
  <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</div>
{{< /example >}}

### Badge

{{< example show_markup="false" >}}
<h1>Example heading <span class="badge bg-primary">New</span></h1>
<h2>Example heading <span class="badge bg-secondary">New</span></h2>
<h3>Example heading <span class="badge bg-success">New</span></h3>
<h4>Example heading <span class="badge bg-danger">New</span></h4>
<h5>Example heading <span class="badge bg-warning text-dark">New</span></h5>
<h6>Example heading <span class="badge bg-info">New</span></h6>
<p class="h6">Example heading <span class="badge bg-light text-dark">New</span></p>
<p class="h6">Example heading <span class="badge bg-dark">New</span></p>
{{< /example >}}

{{< example show_markup="false" >}}
{{< badge.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<span class="badge rounded-pill bg-{{ .name }}{{ if or (eq .name "light") (eq .name "warning") }} text-dark{{ end }}">{{ .name | title }}</span>{{- end -}}
{{< /badge.inline >}}
{{< /example >}}

### Breadcrumb

{{< example show_markup="false" >}}
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item"><a href="#">Library</a></li>
    <li class="breadcrumb-item active" aria-current="page">Data</li>
  </ol>
</nav>
{{< /example >}}

### Buttons

{{< example show_markup="false" >}}
{{< buttons.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<button type="button" class="btn btn-{{ .name }}">{{ .name | title }}</button>
{{- end -}}
{{< /buttons.inline >}}

<button type="button" class="btn btn-link">Link</button>
{{< /example >}}

{{< example show_markup="false" >}}
{{< buttons.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<button type="button" class="btn btn-outline-{{ .name }}">{{ .name | title }}</button>
{{- end -}}
{{< /buttons.inline >}}
{{< /example >}}

{{< example show_markup="false" >}}
<button type="button" class="btn btn-primary btn-sm">Small button</button>
<button type="button" class="btn btn-primary">Standard button</button>
<button type="button" class="btn btn-primary btn-lg">Large button</button>
{{< /example >}}

### Button group

{{< example show_markup="false" >}}
<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
  <div class="btn-group mr-2" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
    <button type="button" class="btn btn-secondary">3</button>
    <button type="button" class="btn btn-secondary">4</button>
  </div>
  <div class="btn-group mr-2" role="group" aria-label="Second group">
    <button type="button" class="btn btn-secondary">5</button>
    <button type="button" class="btn btn-secondary">6</button>
    <button type="button" class="btn btn-secondary">7</button>
  </div>
  <div class="btn-group" role="group" aria-label="Third group">
    <button type="button" class="btn btn-secondary">8</button>
  </div>
</div>
{{< /example >}}

### Card

{{< example show_markup="false" >}}
<div class="row  row-cols-1 row-cols-md-2 g-4">
  <div class="col">
    <div class="card">
      {{< placeholder width="100%" height="180" class="card-img-top" text="Image cap" >}}
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card">
      <div class="card-header">
        Featured
      </div>
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
      <div class="card-footer text-muted">
        2 days ago
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Cras justo odio</li>
        <li class="list-group-item">Dapibus ac facilisis in</li>
        <li class="list-group-item">Vestibulum at eros</li>
      </ul>
      <div class="card-body">
        <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card">
      <div class="row g-0">
        <div class="col-md-4">
          {{< placeholder width="100%" height="250" text="Image" >}}
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{{< /example >}}

### Carousel

{{< example show_markup="false" >}}
<div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
    <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
      {{< placeholder width="800" height="400" class="bd-placeholder-img-lg d-block w-100" color="#555" background="#777" text="First slide" >}}
      <div class="carousel-caption d-none d-md-block">
        <h5>First slide label</h5>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </div>
    </div>
    <div class="carousel-item">
      {{< placeholder width="800" height="400" class="bd-placeholder-img-lg d-block w-100" color="#444" background="#666" text="Second slide" >}}
      <div class="carousel-caption d-none d-md-block">
        <h5>Second slide label</h5>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
    <div class="carousel-item">
      {{< placeholder width="800" height="400" class="bd-placeholder-img-lg d-block w-100" color="#333" background="#555" text="Third slide" >}}
      <div class="carousel-caption d-none d-md-block">
        <h5>Third slide label</h5>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      </div>
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </a>
</div>
{{< /example >}}

### Collapse

{{< example show_markup="false" >}}
<div class="accordion" id="accordionExample">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Collapsible Group Item #1
        </button>
      </h2>
    </div>
    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" id="headingTwo">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          Collapsible Group Item #2
        </button>
      </h2>
    </div>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
      <div class="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" id="headingThree">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          Collapsible Group Item #3
        </button>
      </h2>
    </div>
    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
      <div class="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </div>
  </div>
</div>
{{< /example >}}

### Dropdowns

{{< example show_markup="false" >}}
<div class="btn-group w-100 align-items-center justify-content-around">
  <div class="dropdown">
    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButtonSM" data-toggle="dropdown" aria-expanded="false">
      Dropdown button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonSM">
      <li><h6 class="dropdown-header">Dropdown header</h6></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
      Dropdown button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li><h6 class="dropdown-header">Dropdown header</h6></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
  <div class="dropdown">
    <button class="btn btn-secondary btn-lg dropdown-toggle" type="button" id="dropdownMenuButtonLG" data-toggle="dropdown" aria-expanded="false">
      Dropdown button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonLG">
      <li><h6 class="dropdown-header">Dropdown header</h6></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
</div>
{{< /example >}}

{{< example show_markup="false" >}}
<div class="btn-group">
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false">
  <span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div><!-- /btn-group -->
<div class="btn-group">
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false">
  <span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div><!-- /btn-group -->
<div class="btn-group">
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false">
  <span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div><!-- /btn-group -->
<div class="btn-group">
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false">
  <span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div><!-- /btn-group -->
<div class="btn-group">
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false">
  <span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div><!-- /btn-group -->
<div class="btn-group">
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false">
  <span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div><!-- /btn-group -->
{{< /example >}}

{{< example show_markup="false" >}}
<div class="btn-group w-100 align-items-center justify-content-around">
  <div class="dropright">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="droprightMenuButton" data-toggle="dropdown" aria-expanded="false">
      Dropright button
    </button>
    <ul class="dropdown-menu" aria-labelledby="droprightMenuButton">
      <li><h6 class="dropdown-header">Dropdown header</h6></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
  <div class="dropup">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropupMenuButton" data-toggle="dropdown" aria-expanded="false">
      Dropup button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropupMenuButton">
      <li><h6 class="dropdown-header">Dropdown header</h6></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
  <div class="dropleft">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropleftMenuButton" data-toggle="dropdown" aria-expanded="false">
      Dropleft button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropleftMenuButton">
      <li><h6 class="dropdown-header">Dropdown header</h6></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
</div>
{{< /example >}}

{{< example show_markup="false" >}}
<div class="btn-group">
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownRightMenuButton" data-toggle="dropdown" aria-expanded="false">
      Right-aligned menu
    </button>
    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownRightMenuButton">
      <li><h6 class="dropdown-header">Dropdown header</h6></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
</div>
{{< /example >}}

### List group

{{< example show_markup="false" >}}
<ul class="list-group">
  <li class="list-group-item active" aria-current="true">Cras justo odio</li>
  <li class="list-group-item disabled" aria-disabled="true">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
{{< /example >}}

{{< example show_markup="false" >}}
<ul class="list-group list-group-flush">
  <li class="list-group-item">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
{{< /example >}}

{{< example show_markup="false" >}}
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
{{< list.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
  <a href="#" class="list-group-item list-group-item-action list-group-item-{{ .name }}">A simple {{ .name }} list group item</a>
{{- end -}}
{{< /list.inline >}}
</div>
{{< /example >}}

### Modal

{{< example show_markup="false" >}}
<div class="d-flex justify-content-between">
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
    Launch demo modal
  </button>
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#staticBackdropLive">
    Launch static backdrop modal
  </button>
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenteredScrollable">
    Vertically centered scrollable modal
  </button>
</div>
{{< /example >}}

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="staticBackdropLive" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLiveLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLiveLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>I will not close if you click outside me. Don't even try to press escape key.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Understood</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="exampleModalCenteredScrollable" tabindex="-1" aria-labelledby="exampleModalCenteredScrollableTitle" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenteredScrollableTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

### Navs

{{< example show_markup="false" >}}
<nav class="nav">
  <a class="nav-link active" aria-current="page" href="#">Active</a>
  <a class="nav-link" href="#">Link</a>
  <a class="nav-link" href="#">Link</a>
  <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
</nav>
{{< /example >}}

{{< example show_markup="false" >}}
<nav>
  <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
    <a class="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
    <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</a>
    <a class="nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</a>
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
    <p class="px-3">Consequat occaecat ullamco amet non eiusmod nostrud dolore irure incididunt est duis anim sunt officia. Fugiat velit proident aliquip nisi incididunt nostrud exercitation proident est nisi. Irure magna elit commodo anim ex veniam culpa eiusmod id nostrud sit cupidatat in veniam ad. Eiusmod consequat eu adipisicing minim anim aliquip cupidatat culpa excepteur quis. Occaecat sit eu exercitation irure Lorem incididunt nostrud.</p>
  </div>
  <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
    <p class="px-3">Ad pariatur nostrud pariatur exercitation ipsum ipsum culpa mollit commodo mollit ex. Aute sunt incididunt amet commodo est sint nisi deserunt pariatur do. Aliquip ex eiusmod voluptate exercitation cillum id incididunt elit sunt. Qui minim sit magna Lorem id et dolore velit Lorem amet exercitation duis deserunt. Anim id labore elit adipisicing ut in id occaecat pariatur ut ullamco ea tempor duis.</p>
  </div>
  <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
    <p class="px-3">Est quis nulla laborum officia ad nisi ex nostrud culpa Lorem excepteur aliquip dolor aliqua irure ex. Nulla ut duis ipsum nisi elit fugiat commodo sunt reprehenderit laborum veniam eu veniam. Eiusmod minim exercitation fugiat irure ex labore incididunt do fugiat commodo aliquip sit id deserunt reprehenderit aliquip nostrud. Amet ex cupidatat excepteur aute veniam incididunt mollit cupidatat esse irure officia elit do ipsum ullamco Lorem. Ullamco ut ad minim do mollit labore ipsum laboris ipsum commodo sunt tempor enim incididunt. Commodo quis sunt dolore aliquip aute tempor irure magna enim minim reprehenderit. Ullamco consectetur culpa veniam sint cillum aliqua incididunt velit ullamco sunt ullamco quis quis commodo voluptate. Mollit nulla nostrud adipisicing aliqua cupidatat aliqua pariatur mollit voluptate voluptate consequat non.</p>
  </div>
</div>
{{< /example >}}

{{< example show_markup="false" >}}
<ul class="nav nav-pills">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">Active</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
  </li>
</ul>
{{< /example >}}

### Navbar

{{< example show_markup="false" >}}
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img src="/docs/{{< param docs_version >}}/assets/brand/bootstrap-solid.svg" width="30" height="30" class="d-inline-block align-top" alt="Bootstrap" loading="lazy">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control mr-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-dark" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img src="/docs/{{< param docs_version >}}/assets/brand/bootstrap-solid.svg" width="30" height="30" class="d-inline-block align-top" alt="Bootstrap" loading="lazy">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent2">
      <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown2">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control mr-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-light" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
{{< /example >}}

### Pagination

{{< example show_markup="false" >}}
<nav aria-label="Pagination example">
  <ul class="pagination pagination-sm">
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page">
      <a class="page-link" href="#">2 <span class="visually-hidden">(current)</span></a>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
  </ul>
</nav>
{{< /example >}}

{{< example show_markup="false" >}}
<nav aria-label="Standard pagination example">
  <ul class="pagination">
     <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
{{< /example >}}

{{< example show_markup="false" >}}
<nav aria-label="Another pagination example">
  <ul class="pagination pagination-lg">
    <li class="page-item disabled">
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page">
      <a class="page-link" href="#">2 <span class="visually-hidden">(current)</span></a>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{{< /example >}}

### Popovers

{{< example show_markup="false" >}}
<button type="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>
{{< /example >}}

{{< example show_markup="false" >}}
<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on top
</button>
<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on right
</button>
<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on bottom
</button>
<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on left
</button>
{{< /example >}}

### Progress

{{< example show_markup="false" >}}
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
</div>
<div class="progress">
  <div class="progress-bar bg-success w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
</div>
<div class="progress">
  <div class="progress-bar bg-info w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
</div>
<div class="progress">
  <div class="progress-bar bg-warning text-dark w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>
</div>
<div class="progress">
  <div class="progress-bar bg-danger w-100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>
</div>
{{< /example >}}

{{< example show_markup="false" >}}
<div class="progress">
  <div class="progress-bar" role="progressbar" style="width: 15%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
  <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
</div>
{{< /example >}}

### Scrollspy

<div class="bd-example">
  <nav id="navbar-example2" class="navbar navbar-light bg-light px-3">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="nav nav-pills">
      <li class="nav-item">
        <a class="nav-link" href="#fat">@fat</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#mdo">@mdo</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#one">one</a></li>
          <li><a class="dropdown-item" href="#two">two</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#three">three</a></li>
        </ul>
      </li>
    </ul>
  </nav>
  <div data-spy="scroll" data-target="#navbar-example2" data-offset="0" class="scrollspy-example">
    <h4 id="fat">@fat</h4>
    <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
    <h4 id="mdo">@mdo</h4>
    <p>Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard. Freegan beard aliqua cupidatat mcsweeney's vero. Cupidatat four loko nisi, ea helvetica nulla carles. Tattooed cosby sweater food truck, mcsweeney's quis non freegan vinyl. Lo-fi wes anderson +1 sartorial. Carles non aesthetic exercitation quis gentrify. Brooklyn adipisicing craft beer vice keytar deserunt.</p>
    <h4 id="one">one</h4>
    <p>Occaecat commodo aliqua delectus. Fap craft beer deserunt skateboard ea. Lomo bicycle rights adipisicing banh mi, velit ea sunt next level locavore single-origin coffee in magna veniam. High life id vinyl, echo park consequat quis aliquip banh mi pitchfork. Vero VHS est adipisicing. Consectetur nisi DIY minim messenger bag. Cred ex in, sustainable delectus consectetur fanny pack iphone.</p>
    <h4 id="two">two</h4>
    <p>In incididunt echo park, officia deserunt mcsweeney's proident master cleanse thundercats sapiente veniam. Excepteur VHS elit, proident shoreditch +1 biodiesel laborum craft beer. Single-origin coffee wayfarers irure four loko, cupidatat terry richardson master cleanse. Assumenda you probably haven't heard of them art party fanny pack, tattooed nulla cardigan tempor ad. Proident wolf nesciunt sartorial keffiyeh eu banh mi sustainable. Elit wolf voluptate, lo-fi ea portland before they sold out four loko. Locavore enim nostrud mlkshk brooklyn nesciunt.</p>
    <h4 id="three">three</h4>
    <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
    <p>Keytar twee blog, culpa messenger bag marfa whatever delectus food truck. Sapiente synth id assumenda. Locavore sed helvetica cliche irony, thundercats you probably haven't heard of them consequat hoodie gluten-free lo-fi fap aliquip. Labore elit placeat before they sold out, terry richardson proident brunch nesciunt quis cosby sweater pariatur keffiyeh ut helvetica artisan. Cardigan craft beer seitan readymade velit. VHS chambray laboris tempor veniam. Anim mollit minim commodo ullamco thundercats.
    </p>
  </div>
</div>

### Spinners

{{< example show_markup="false" >}}
{{< spinner.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<div class="spinner-border text-{{ .name }}" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
{{- end -}}
{{< /spinner.inline >}}
{{< /example >}}

{{< example show_markup="false" >}}
{{< spinner.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<div class="spinner-grow text-{{ .name }}" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
{{- end -}}
{{< /spinner.inline >}}
{{< /example >}}

### Toasts

{{< example show_markup="false" class="bg-dark" >}}
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    {{< placeholder width="20" height="20" background="#007aff" class="rounded mr-2" text="false" title="false" >}}
    <strong class="mr-auto">Bootstrap</strong>
    <small class="text-muted">11 mins ago</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>
{{< /example >}}

### Tooltips

{{< example show_markup="false" class="tooltip-demo" >}}
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">Tooltip on right</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-html="true" title="<em>Tooltip</em> <u>with</u> <b>HTML</b>">Tooltip with HTML</button>
{{< /example >}}
