# www.robotstxt.org

{{- $isNetlify := eq (getenv "NETLIFY") "true" -}}
{{- $allowCrawling := and (not $isNetlify) hugo.IsProduction -}}

{{ if $allowCrawling }}
# Allow crawling of all content
{{- end }}
User-agent: *
Disallow:{{ if not $allowCrawling }} /{{ end }}
Sitemap: {{ "/sitemap.xml" | absURL }}
