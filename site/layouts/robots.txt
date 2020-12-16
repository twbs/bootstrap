# www.robotstxt.org

{{- $isProduction := eq hugo.Environment "production" -}}
{{- $isNetlify := eq (getenv "NETLIFY") "true" -}}
{{- $allowCrawling := and (not $isNetlify) $isProduction -}}

{{ if $allowCrawling }}
# Allow crawling of all content
{{- end }}
User-agent: *
Disallow:{{ if not $allowCrawling }} /{{ end }}
Sitemap: {{ "/sitemap.xml" | absURL }}
