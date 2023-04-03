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
<table class="table">
  <tbody>
  {{ range $.Site.Data.bootstrap.classes }}
    <tr>
      <td>{{ . }}</td>
    </tr>
  {{ end }}
  </ul>
  </tbody>
</table>
{{< /tables.inline >}}
