---
layout: docs
title: Brand guidelines
description: Documentation and examples for Bootstrap's logo and brand usage guidelines.
group: about
toc: true

---

Have a need for Bootstrap's brand resources? Great! We have only a few guidelines we follow, and in turn ask you to follow as well.

## Logo

When referencing Bootstrap, use our logo mark. Do not modify our logos in any way. Do not use Bootstrap's branding for your own open or closed source projects.

<div class="bd-brand-item px-2 py-5 mb-3 border rounded-3">
  <img class="d-block img-fluid mx-auto" src="/docs/{{< param docs_version >}}/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="256" height="204">
</div>

Our logo mark is also available in black and white. All rules for our primary logo apply to these as well.

<div class="bd-brand-logos d-sm-flex text-center bg-light rounded-3 overflow-hidden w-100 mb-3">
  <div class="bd-brand-item w-100 px-2 py-5">
    <img src="/docs/{{< param docs_version >}}/assets/brand/bootstrap-logo-black.svg" alt="Bootstrap" width="128" height="102" loading="lazy">
  </div>
  <div class="bd-brand-item w-100 px-2 py-5 inverse">
    <img src="/docs/{{< param docs_version >}}/assets/brand/bootstrap-logo-white.svg" alt="Bootstrap" width="128" height="102" loading="lazy">
  </div>
</div>

## Name

Bootstrap should always be referred to as just **Bootstrap**. No capital _s_.

<div class="bd-brand-logos d-sm-flex text-center border rounded-3 overflow-hidden w-100 mb-3">
  <div class="bd-brand-item w-100 px-2 py-5">
    <div class="h3">Bootstrap</div>
    <strong class="text-success">Correct</strong>
  </div>
  <div class="bd-brand-item w-100 px-2 py-5">
    <div class="h3 text-body-secondary">BootStrap</div>
    <strong class="text-danger">Incorrect</strong>
  </div>
</div>

## Brand Colors

When creating projects using Bootstrap, it is essential to use the appropriate brand colors to maintain consistency and alignment with our visual identity. The following colors should be used in your designs:

| Color Name       | Hex Code   | Usage                          |
|------------------|------------|--------------------------------|
| Bootstrap Blue    | `#007bff` | Primary buttons and links      |
| Bootstrap Indigo  | `#6610f2` | Secondary buttons              |
| Bootstrap Purple   | `#6f42c1` | Highlighting elements          |
| Bootstrap Pink     | `#e83e8c` | Alerts and notifications       |
| Bootstrap Red      | `#dc3545` | Error messages and alerts      |
| Bootstrap Orange   | `#fd7e14` | Warning messages               |
| Bootstrap Yellow    | `#ffc107` | Informational messages         |
| Bootstrap Green     | `#28a745` | Success messages               |
| Bootstrap Teal      | `#20c997` | Success buttons and alerts     |
| Bootstrap Cyan      | `#17a2b8` | Informational buttons          |
| Bootstrap Gray      | `#6c757d` | Text and backgrounds           |

### Guidelines

- **Open Source Projects**: You can use Bootstrap's brand colors freely in open-source projects, as long as you adhere to the guidelines laid out in this document.
- **Closed Source Projects**: For closed-source projects, you may also use the brand colors, provided you do not misrepresent your project as being officially affiliated with Bootstrap.

All color examples should be responsive and work well in various design contexts.

```html
<div class="container">
  <div class="row">
    <div class="col text-center">
      <div class="bg-primary text-white p-3">Bootstrap Blue</div>
      <div class="bg-secondary text-white p-3">Bootstrap Indigo</div>
      <div class="bg-success text-white p-3">Bootstrap Green</div>
    </div>
  </div>
</div>
