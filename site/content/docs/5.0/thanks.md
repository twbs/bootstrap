---
layout: docs
title: Support the team
group: thanks
aliases: "/thanks/"
toc: true
---

Through donations and sponsorships we are able to maintain & improve Bootstrap. Feel free to show your support on our [Open Collective page](https://opencollective.com/bootstrap).

## Sponsors

{{< sponsors.inline >}}
{{- $ocURL := "https://opencollective.com/bootstrap/members/all.json" -}}
{{- $sponsors := getJSON $ocURL "?TierId=7193&limit=10&offset=0" -}}
<div class="d-flex flex-wrap mx-n2 text-center font-weight-bold">
  {{- range $sponsors }}
    {{- if .isActive -}}
      <div class="m-2 position-relative">
        <div style="width:100px; height: 100px;" class="img-thumbnail d-flex align-items-center justify-content-center overflow-hidden">
          <div class="w-100">
            <img src="{{- .image -}}" alt="{{- .name -}}" class="mh-100 mw-100">
          </div>
        </div>
        <h3 class="h6 pt-2">
            {{ if .website -}}
              <a href="{{- .website -}}" class="stretched-link text-reset">{{- .name -}}</a>
            {{ else -}}
              {{- .name -}}
            {{ end -}}
        </h3>
      </div>
    {{- end -}}
  {{- end -}}
</div>
{{< /sponsors.inline >}}

## Backers

{{< backers.inline >}}
{{- $ocURL := "https://opencollective.com/bootstrap/members/all.json" -}}
{{- $sponsors := getJSON $ocURL "?TierId=7192&limit=10&offset=0" -}}
<div class="d-flex flex-wrap mx-n1 text-center font-weight-bold">
  {{- range $sponsors }}
    {{- if .isActive -}}
      <div class="m-1 position-relative">
        <div style="width:50px; height: 50px;" class="img-thumbnail d-flex align-items-center justify-content-center overflow-hidden">
          {{ if .website -}}
            <a href="{{- .website -}}" class="stretched-link text-reset" title="{{- .name -}}">
          {{ end -}}
          <img src="{{- .image -}}" alt="{{- .name -}}" class="mh-100 mw-100">
          {{ if .website -}}
            </a>
          {{ end -}}
        </div>
      </div>
    {{- end -}}
  {{- end -}}
</div>
{{< /backers.inline >}}

## Services

{{< services.inline >}}
<div class="d-flex mx-n3 flex-wrap">
  {{- range (index $.Site.Data "services") }}
    <div class="m-3 position-relative">
      {{ if .website -}}
        <a href="{{- .website -}}" class="stretched-link text-reset" title="{{- .name -}}">
      {{ end -}}
      <img src="../assets/img/services/{{- .image -}}" alt="{{- .name -}}" class="mh-100 mw-100">
      {{ if .website -}}
        </a>
      {{ end -}}
    </div>
  {{ end -}}
</div>
{{< /services.inline >}}
