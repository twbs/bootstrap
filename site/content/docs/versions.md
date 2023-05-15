---
title: Versions
description: An appendix of hosted documentation for nearly every release of Bootstrap, from v1 through v5.
---

{{< list-versions.inline >}}
<div class="row">
  {{- range $release := sort (index $.Site.Data "docs-versions") "group" "desc" }}
  <div class="col-md-6 col-lg-4 col-xl mb-4">
    <h2>{{ $release.group }}</h2>
    <p>{{ $release.description }}</p>
    {{- $versions := sort $release.versions "" "desc" -}}
    {{- range $i, $version := $versions }}
      {{- $len := len $versions -}}
      {{ if (eq $i 0) }}<div class="list-group">{{ end }}
        <a class="list-group-item list-group-item-action py-2 text-primary{{ if (eq $version $.Site.Params.docs_version) }} d-flex justify-content-between align-items-center{{ end }}" href="{{ $release.baseurl }}/{{ $version }}/">
          {{ $version }}
          {{ if (eq $version $.Site.Params.docs_version) -}}
          <span class="badge bg-primary">Latest</span>
          {{- end }}
        </a>
      {{ if (eq (add $i 1) $len) }}</div>{{ end }}
    {{ end -}}
  </div>
  {{ end -}}
</div>
{{< /list-versions.inline >}}
