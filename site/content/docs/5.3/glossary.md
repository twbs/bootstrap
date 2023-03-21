---
layout: docs
title: Glossary
description: List of all classes in our Bootstrap CSS
group: glossary
aliases: "/glossary/"
toc: true
---

## Glossary

{{< tables.inline >}}
{{ $file := split (readFile (path.Join "site/static/docs" .Site.Params.docs_version "assets/data/glossary.data")) "\n" }}
<table class="table">
  <tbody>
    {{- range $file }}
    {{ $class := split . ":" }}
    <tr>
      <td>
      {{ if gt (len (string (index $class 1))) 1 }}
      <a href="/docs/{{ $.Site.Params.docs_version }}/{{ (index $class 1) }}">{{ index $class 0 }}</a>
      {{ else }}
      <span>{{ index $class 0 }}</span>
      {{ end }}
      </td>
    </tr>
    {{- end -}}
  </tbody>
</table>
{{< /tables.inline >}}
