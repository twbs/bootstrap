---
layout: docs
title: Application-Form
description: Documentation for the correct implementation of the Application-Form.
group: components
---

Small and adaptive tag for adding context to just about any content.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

Default Application-Form in horizontal alignment

{% example html %}
<div class="card">
  <div class="card-header card-inverse application-form-header">
  <div class="row">
    <div class="col-12 col-sm-4 align-self-center text-center">
      <p class="h1 my-auto">Jetzt bewerben</p>
    </div>
    <div class="col-12 col-sm-8 application-form-title align-self-center">
      <p class="my-auto">Fachinformatiker für Anwendungsentwicklung (m/w) zum September 2017</p>
    </div>
  </div>
  </div>
  <div class="card-block application-form">
      <div class="container mt-4">
        <div class="row">
            <div class="col-12">
            <p class="card-text-color">Schicke ganz einfach Deine Bewerbung über {domain} ab und wir informieren Dich per Email, sobald der Arbeitgeber die Bewerbung heruntergeladen hat.</p>
            <form class="inline-form">
                <div class="row">
                    <div class="col-12 col-md-6 mb-2">
                        <input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="Vorname">
                    </div>
                    <div class="col-12 col-md-6">
                        <input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="Nachname">
                    </div>
                    <div class="col-12 col-md-8 mb-2">
                        <input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="E-mail">
                    </div>
                    <div class="col-12 col-md-4">
                        <input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="Telefon optional">
                    </div>
                    <div class="col-12 mt-2">
                        <p class="h3 card-text-color">Unterlagen</p>
                    </div>
                    <div class="col-12">
                      <p class="dash-border card-text-color text-center p-2">File upload</p>
                    </div>
                    <div class="col-12">
                        <p class="card-text-color"><strong> Bitte füge Deinen Lebenslauf hinzu, um die Bewerbung abzuschließen.</strong> <br /> Wenn du möchtest, kannst Du bis zu 5 weitere Dokumente hochladen. Unterstützte Dateiformate sind: .pdf, .doc, .docx, .jpg, .png, .odt, .rtf, .txt. Maximale Dateigröße 5 MB.</p>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                      <button type="button" class="btn btn-primary btn-lg">Bewerbung Senden</button>
                    </div>
                    <div class="col-6 align-self-center">
                        <div class="row">
                            <div class="col-12 col-md-10 text-right align-self-center">
                                <p class="card-text-color card-text-font-size my-auto">Joblocal GmbH</p>
                            </div>
                            <div class="col-2 push-10 push-md-0">
                                <img class="img-fluid" data-src="holder.js/50x50?auto=yes&bg=777&fg=555&text=logo" alt="Image" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            </div>
          </div>
      </div>
  </div>
</div>
{% endexample %}
