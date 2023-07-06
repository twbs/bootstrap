---
layout: single
title: Examples
description: Quickly get a project started with any of our examples ranging from using parts of the framework to custom components and layouts.
aliases: "/examples/"
---

{{< list-examples.inline >}}
{{ range $entry := $.Site.Data.examples -}}
<div class="bd-content">
  <h2 id="{{ $entry.category | urlize }}">{{ $entry.category }}</h2>
  <p>{{ $entry.description }}</p>
  {{ if eq $entry.category "RTL" -}}
    <div class="bd-callout bd-callout-warning small">
      <p>
        <strong>RTL is still experimental</strong> and will evolve with feedback. Spotted something or have an improvement to suggest?
      </p>
      <p><a href="{{ $.Site.Params.repo }}/issues/new/choose">Please open an issue.</a></p>
    </div>
  {{ end -}}
  {{ range $i, $example := $entry.examples -}}
    {{- $len := len $entry.examples -}}
    {{ if (eq $i 0) }}<div class="row">{{ end }}
      {{ if $entry.external }}
        <div class="col-md-6 col-lg-4 mb-3 d-flex gap-3">
          <svg class="bi fs-5 flex-shrink-0 mt-1"><use xlink:href="#box-seam"></use></svg>
          <div>
            <h3 class="h5 mb-1">
              <a class="d-block link-offset-1" href="{{ $.Site.Params.github_org }}{{ $example.url }}/" target="_blank" rel="noopener">
                {{ $example.name }}
              </a>
            </h3>
            <p class="text-body-secondary">{{ $example.description }}</p>
            <p>
              {{- $indexPath := "index.html" -}}
              {{- if $example.indexPath -}}
                {{- $indexPath = $example.indexPath -}}
              {{- end }}
              <a class="icon-link small link-secondary link-offset-1" href="https://stackblitz.com/github/twbs{{ $example.url }}?file={{ $indexPath | urlquery }}" target="_blank" rel="noopener">
                <svg class="bi flex-shrink-0"><use xlink:href="#lightning-charge-fill"></use></svg>
                Edit in StackBlitz
              </a>
            </p>
          </div>
        </div>
      {{ else }}
        <div class="col-sm-6 col-md-3 mb-3">
          <a class="d-block link-offset-1" href="/docs/{{ $.Site.Params.docs_version }}/examples/{{ $example.name | urlize }}/"{{ if in $example.name "RTL" }} hreflang="ar"{{ end }}>
            <img class="img-thumbnail mb-3" srcset="/docs/{{ $.Site.Params.docs_version }}/assets/img/examples/{{ $example.name | urlize }}.png,
                                                    /docs/{{ $.Site.Params.docs_version }}/assets/img/examples/{{ $example.name | urlize }}@2x.png 2x"
                                            src="/docs/{{ $.Site.Params.docs_version }}/assets/img/examples/{{ $example.name | urlize }}.png"
                                            alt=""
                                            width="480" height="300"
                                            loading="lazy">
            <h3 class="h5 mb-1">
              {{ $example.name }}
            </h3>
          </a>
          <p class="text-body-secondary">{{ $example.description }}</p>
        </div>
      {{ end }}
    {{ if (eq (add $i 1) $len) }}</div>{{ end }}
  {{ end -}}
</div>
{{ end -}}
{{< /list-examples.inline >}}
