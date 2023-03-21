---
layout: docs
title: Diff
description: Compare HTML classes from different Bootstrap versions
group: diff
aliases: "/diff/"
---

<script type="module">
  // TODO: Use https://gohugo.io/functions/safejs/

  const file = await fetch('/docs/5.3/assets/json/diffs/bootstrap-from-4.6.2-to-5.3.0.diff.json');
  const text = await file.text();
  
  function getElements(divId, dataArray) {
    const listContainer = document.getElementById(divId);
    const listElement = document.createElement('ul');
    for (const item of dataArray) {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      listElement.appendChild(listItem);
    }
    listContainer.appendChild(listElement);
  }

  getElements('removedElements', JSON.parse(text).removed);
  getElements('addedElements', JSON.parse(text).added);
</script>

<form>
  <div class="mb-3">
    <label for="fromVersions" class="form-label">From</label>
    <select class="form-select" aria-label="Default select example" id="fromVersions">
      <option selected>Open this select menu</option>
      <option value="1">v4.6.2</option>
      <option value="2">v5.0.0</option>
      <option value="3">v5.1.3</option>
    </select>
  </div>
  <div class="mb-3">
    <label for="toVersions" class="form-label">To</label>
    <select class="form-select" aria-label="Default select example" id="toVersions">
      <option selected>Open this select menu</option>
      <option value="2">v5.0.0</option>
      <option value="3">v5.1.3</option>
      <option value="3">v5.1.3</option>
    </select>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

# Deprecated classes

<div id="removedElements">
</div>

# New classes

<div id="addedElements">
</div>
