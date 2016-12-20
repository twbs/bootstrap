---
layout: docs
title: Wall of browser bugs
group: browser-bugs
---

Bootstrap currently works around several outstanding browser bugs in major browsers to deliver the best cross-browser experience possible. Some bugs, like those listed below, cannot be solved by us.

We publicly list browser bugs that are impacting us here, in the hopes of expediting the process of fixing them. For information on Bootstrap's browser compatibility, [see our browser compatibility docs]({{ site.baseurl }}/getting-started/browsers-devices/#supported-browsers).

Also see [jQuery's browser bug workarounds](https://docs.google.com/document/d/1LPaPA30bLUB_publLIMF0RlhdnPx_ePXm7oW02iiT6o).

See also:

* [Chromium issue 536263: [meta] Issues affecting Bootstrap](https://code.google.com/p/chromium/issues/detail?id=536263)
* [Mozilla bug 1230801: Fix the issues that affect Bootstrap](https://bugzilla.mozilla.org/show_bug.cgi?id=1230801)
* [jQuery's browser bug workarounds](https://docs.google.com/document/d/1LPaPA30bLUB_publLIMF0RlhdnPx_ePXm7oW02iiT6o)

<div class="table-responsive">
  <table class="bd-browser-bugs table table-bordered table-hover">
    <thead>
      <tr>
        <th>Browser(s)</th>
        <th>Summary of bug</th>
        <th>Upstream bug(s)</th>
        <th>Bootstrap issue(s)</th>
      </tr>
    </thead>
    <tbody>
      {% for bug in site.data.browser-bugs %}
      <tr>
        <td>{{ bug.browser }}</td>
        <td>{{ bug.summary | markdownify | bugify }}</td>
        <td>{{ bug.upstream_bug | bugify }}</td>
        <td>{{ bug.origin | bugify }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
