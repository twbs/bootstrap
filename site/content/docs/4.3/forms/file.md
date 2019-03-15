---
layout: docs
title: File browser
description: ...
group: forms
toc: true
---

{{< callout info >}}
The recommended plugin to animate custom file input: [bs-custom-file-input](https://www.npmjs.com/package/bs-custom-file-input), that's what we are using currently here in our docs.
{{< /callout >}}

The file input is the most gnarly of the bunch and requires additional JavaScript if you'd like to hook them up with functional *Choose file...* and selected file name text.

{{< example >}}
<div class="custom-file">
  <input type="file" class="custom-file-input" id="customFile">
  <label class="custom-file-label" for="customFile">Choose file</label>
</div>
{{< /example >}}

We hide the default file `<input>` via `opacity` and instead style the `<label>`. The button is generated and positioned with `::after`. Lastly, we declare a `width` and `height` on the `<input>` for proper spacing for surrounding content.

#### Translating or customizing the strings with SCSS

The [`:lang()` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang) is used to allow for translation of the "Browse" text into other languages. Override or add entries to the `$custom-file-text` Sass variable with the relevant [language tag](https://en.wikipedia.org/wiki/IETF_language_tag) and localized strings. The English strings can be customized the same way. For example, here's how one might add a Spanish translation (Spanish's language code is `es`):

{{< highlight scss >}}
$custom-file-text: (
  en: "Browse",
  es: "Elegir"
);
{{< /highlight >}}

Here's `lang(es)` in action on the custom file input for a Spanish translation:

{{< example >}}
<div class="custom-file">
  <input type="file" class="custom-file-input" id="customFileLang" lang="es">
  <label class="custom-file-label" for="customFileLang">Seleccionar Archivo</label>
</div>
{{< /example >}}

You'll need to set the language of your document (or subtree thereof) correctly in order for the correct text to be shown. This can be done using [the `lang` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) on the `<html>` element or the [`Content-Language` HTTP header](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.12), among other methods.

#### Translating or customizing the strings with HTML

Bootstrap also provides a way to translate the "Browse" text in HTML with the `data-browse` attribute which can be added to the custom input label (example in Dutch):

{{< example >}}
<div class="custom-file">
  <input type="file" class="custom-file-input" id="customFileLangHTML">
  <label class="custom-file-label" for="customFileLangHTML" data-browse="Bestand kiezen">Voeg je document toe</label>
</div>
{{< /example >}}
