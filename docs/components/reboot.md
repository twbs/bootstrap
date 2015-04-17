---
layout: page
title: Reboot
---

Several HTML elements are "rebooted" by Bootstrap for a more logical starting point and easier customization. This reboot builds upon Normalize, and as such, only uses element selectors to add our own opinionated resets.

## Approach

Here are our guidelines for choosing what to override in our reboot:

- Only use `rem`s and `em`s as the global units whenever possible.
- Avoid `margin-top` whenever possible. Vertical margins often collapse, sometimes yielding unexpected results. Moreover, a single direction of `margin` is an easier and quicker mental model to adopt.


## Headings and paragaphs

All heading elements—e.g., `<h1>`—and `<p>` are reset to have their `margin-top` removed. Headings have `margin-bottom: .5rem` added and paragraphs `margin-bottom: 1rem` for easy spacing.

<div class="bd-example">
{% markdown %}
# h1 heading
Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

## h2 heading
Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

### h3 heading
Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

#### h4 heading
Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

##### h5 heading
Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

###### h6 heading
Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
{% endmarkdown %}
</div>

## Lists

All lists—`<ul>`, `<ol>`, and `<dl>`—have their `margin-top` removed and a `margin-bottom: 1rem`. Nested lists have no `margin-bottom`.

<div class="bd-example">
{% markdown %}
* Lorem ipsum dolor sit amet
* Consectetur adipiscing elit
* Integer molestie lorem at massa
* Facilisis in pretium nisl aliquet
* Nulla volutpat aliquam velit
  * Phasellus iaculis neque
  * Purus sodales ultricies
  * Vestibulum laoreet porttitor sem
  * Ac tristique libero volutpat at
* Faucibus porta lacus fringilla vel
* Aenean sit amet erat nunc
* Eget porttitor lorem

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
4. Facilisis in pretium nisl aliquet
5. Nulla volutpat aliquam velit
6. Faucibus porta lacus fringilla vel
7. Aenean sit amet erat nunc
8. Eget porttitor lorem
{% endmarkdown %}
</div>

For simpler styling, clear hierarchy, and better spacing, description lists have updated `margin`s. `<dd>`s reset `margin-left` to `0` and add `margin-bottom: .5rem`. `<dt>`s are **bolded**.

<div class="bd-example">
{% markdown %}
<dl>
  <dt>Description lists</dt>
  <dd>A description list is perfect for defining terms.</dd>
  <dt>Euismod</dt>
  <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem.</dd>
  <dd>Donec id elit non mi porta gravida at eget metus.</dd>
  <dt>Malesuada porta</dt>
  <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
</dl>
{% endmarkdown %}
</div>

## Tables

Tables are slightly adjusted to style `<caption>`s and ensure consistent `text-align` throughout.

<div class="bd-example">
  <table>
    <caption>
      This is an example table, and this is it's caption to describe the contents.
    </caption>
    <thead>
      <tr>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
    </tbody>
  </table>
</div>

## Code blocks

The `<pre>` element is reset to remove its `margin-top` and use `rem` units for its `margin-bottom`.

<div class="bd-example">
{% markdown %}
```
pre {
  margin-bottom: 1rem;
}
```
{% endmarkdown %}
</div>


## Inline elements

<div class="bd-example">
{% markdown %}
Praesent commodo cursus magna, vel scelerisque nisl consectetur et. For example, `<section>` should be wrapped as inline. Nulla <abbr title="attribute">attr</abbr> vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus.
{% endmarkdown %}
</div>





<h1>Address</h1>

<address>
  <strong>Twitter, Inc.</strong><br>
  795 Folsom Ave, Suite 600<br>
  San Francisco, CA 94107<br>
  <abbr title="Phone">P:</abbr> (123) 456-7890
</address>

<address>
  <strong>Full Name</strong><br>
  <a href="mailto:#">first.last@example.com</a>
</address>

<hr>

<h1>Blockquote</h1>

<blockquote>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote>

<hr>

<h1>Tables</h1>

<table>
  <caption>
    This is an example table, and this is it's caption to describe the contents.
  </caption>
  <thead>
    <tr>
      <th>Table heading</th>
      <th>Table heading</th>
      <th>Table heading</th>
      <th>Table heading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
    </tr>
    <tr>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
    </tr>
    <tr>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
    </tr>
  </tbody>
</table>

<hr>

<h1>Forms</h1>

<form>
  <fieldset>
    <legend>Example legend</legend>

    <p>
      <label for="input">Example input</label>
      <input type="text" id="input" placeholder="Example input">
    </p>

    <p>
      <label for="select">Example select</label>
      <select id="select">
        <option value="">Choose...</option>
        <optgroup label="Option group 1">
          <option value="">Option 1</option>
          <option value="">Option 2</option>
          <option value="">Option 3</option>
        </optgroup>
        <optgroup label="Option group 2">
          <option value="">Option 4</option>
          <option value="">Option 5</option>
          <option value="">Option 6</option>
        </optgroup>
      </select>
    </p>

    <formgroup>
      <label>
        <input type="checkbox" value="">
        Check this checkbox
      </label>
    </formgroup>

    <formgroup>
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
        Option one is this and that
      </label>
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
        Option two is something else that's also super long to demonstrate the wrapping of these fancy form controls.
      </label>
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
        Option three is disabled
      </label>
    </formgroup>

    <p>
      <label for="textarea">Example textarea</label>
      <textarea id="example" rows="3"></textarea>
    </p>

    <p>
      <label for="file">Example file</label>
      <input type="file">
    </p>

    <p>
      <label for="progress">Example progress bar</label>
      <progress value="25" min="0" max="100"></progress>
    </p>

    <p>
      <label for="range">Example range</label>
      <input type="range">
    </p>

    <p>
      <label for="time">Example temporal</label>
      <input type="date">
    </p>

    <p>
      <button type="submit">Button submit</button>
      <input type="submit" value="Input submit button">
      <input type="button" value="Input button">
    </p>

    <p>
      <button type="submit" disabled>Button submit</button>
      <input type="submit" value="Input submit button" disabled>
      <input type="button" value="Input button" disabled>
    </p>
  </fieldset>
</form>
