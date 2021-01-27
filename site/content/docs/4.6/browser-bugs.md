---
layout: docs
title: Wall of browser bugs
group: browser-bugs
aliases: "/browser-bugs/"
---

{{< callout danger >}}
##### Outdated content

This page is outdated and is no longer applicable to the latest versions of Bootstrap. It's here purely for historical purposes now and will be removed in our next major release.
{{< /callout >}}

Bootstrap currently works around several outstanding browser bugs in major browsers to deliver the best cross-browser experience possible. Some bugs, like those listed below, cannot be solved by us.

We publicly list browser bugs that are impacting us here, in the hopes of expediting the process of fixing them. For information on Bootstrap's browser compatibility, [see our browser compatibility docs]({{< docsref "/getting-started/browsers-devices#supported-browsers" >}}).

See also:

* [Chromium issue 536263: [meta] Issues affecting Bootstrap](https://bugs.chromium.org/p/chromium/issues/detail?id=536263)
* [Mozilla bug 1230801: Fix the issues that affect Bootstrap](https://bugzilla.mozilla.org/show_bug.cgi?id=1230801)
* [WebKit bug 159753: [meta] Issues affecting Bootstrap](https://bugs.webkit.org/show_bug.cgi?id=159753)
* [jQuery's browser bug workarounds](https://docs.google.com/document/d/1LPaPA30bLUB_publLIMF0RlhdnPx_ePXm7oW02iiT6o)


{{< bug.inline >}}
{{- $type := .Get "type" | default "bug" -}}
{{- $data := .Get "data" | default "browser-bugs" -}}
<table class="bd-browser-bugs table table-bordered table-hover">
  <thead>
    <tr>
      <th>Browser(s)</th>
      <th>Summary of {{ $type }}</th>
      <th>Upstream issue(s)</th>
      <th>Bootstrap issue(s)</th>
    </tr>
  </thead>
  <tbody>
    {{- range (index $.Site.Data $data) }}
    <tr>
      <td>{{ .browser | chomp }}</td>
      <td>{{ .summary | markdownify }}</td>
      <td>{{ partial "bugify" .upstream_bug }}</td>
      <td>{{ partial "bugify" .origin }}</td>
    </tr>
    {{- end }}
  </tbody>
</table>
 {{< /bug.inline >}}

# Most wanted features

There are several features specified in Web standards which would allow us to make Bootstrap more robust, elegant, or performant, but aren't yet implemented in certain browsers, thus preventing us from taking advantage of them.

We publicly list these "most wanted" feature requests here, in the hopes of expediting the process of getting them implemented.

{{< bug.inline data="browser-features" type="feature" />}}
