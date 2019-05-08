---
layout: docs
title: Thanks
description: To say thanks to our sponsors and services which support us.
group: thanks
aliases: "/thanks/"
toc: true
---

## Sponsors

{{< sponsors.inline >}}
{{- $ocURL := "https://opencollective.com/bootstrap/members/all.json" -}}
{{- $sponsors := getJSON $ocURL "?TierId=7193&limit=10&offset=0" -}}
<div class="row">
  {{- range $sponsors }}
    {{- if .isActive -}}
      <div class="col-3 d-flex mb-2">
        <div class="card w-100 text-center">
          <img src="{{- .image -}}" class="card-img-top" alt="{{- .name -}}">
          <div class="card-body border-top">
            <h5 class="card-title">
              {{ if .website -}}
              <a href="{{- .website -}}">{{- .name -}}</a>
              {{ else -}}
              {{- .name -}}
              {{ end -}}
            </h5>
            {{ with .description }}<p class="card-text">{{ . | chomp }}</p>{{ end }}
          </div>
        </div>
      </div>
    {{- end -}}
  {{- end -}}
</div>
{{< /sponsors.inline >}}

## Backers

{{< backers.inline >}}
{{- $ocURL := "https://opencollective.com/bootstrap/members/all.json" -}}
{{- $sponsors := getJSON $ocURL "?TierId=7192&limit=10&offset=0" -}}
<div class="row">
  {{- range $sponsors }}
    {{- if .isActive -}}
      <div class="col-3 d-flex mb-2">
        <div class="card w-100 text-center">
          <img src="{{- .image -}}" class="card-img-top" alt="{{- .name -}}">
          <div class="card-body border-top">
            <h5 class="card-title">
              {{ if .website -}}
              <a href="{{- .website -}}">{{- .name -}}</a>
              {{ else -}}
              {{- .name -}}
              {{ end -}}
            </h5>
            {{ with .description }}<p class="card-text">{{ . | chomp }}</p>{{ end }}
          </div>
        </div>
      </div>
    {{- end -}}
  {{- end -}}
</div>
{{< /backers.inline >}}

## Services

{{< services.inline >}}
<div class="row">
  <div class="col-3 d-flex mb-2">
    <div class="card w-100 text-center">
      <div style="background-color: #142433">
        <img src="https://3fxtqy18kygf3on3bu39kh93-wpengine.netdna-ssl.com/wp-content/themes/browserstack/img/browserstack-logo.svg" class="card-img-top" alt="BrowserStack">
      </div>
      <div class="card-body border-top">
        <h5 class="card-title">
          <a href="https://www.browserstack.com/">BrowserStack</a>
        </h5>
        <p class="card-text">Instant access to 2000+ browsers and real iOS and Android devices for cross browser testing. Ship apps and websites that work for everyone, every time. Get Free Trial.</p>
      </div>
    </div>
  </div>
</div>
{{< /services.inline >}}
