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
<div id="sponsorList" class="d-flex flex-wrap mx-n2 text-center font-weight-bold"></div>
{{< /sponsors.inline >}}

## Backers

{{< backers.inline >}}
<div id="backerList" class="d-flex flex-wrap mx-n1 text-center font-weight-bold"></div>
{{< /backers.inline >}}

## Services

{{< services.inline >}}
<div class="d-flex mx-n3 flex-wrap">
  {{- range (index $.Site.Data "services") }}
    <div class="m-3 position-relative">
      {{ if .website -}}
        <a href="{{ .website }}" class="stretched-link text-reset" title="{{ .name }}">
      {{ end -}}
      <img src="{{ printf ("/docs/%s/assets/img/services/%s") $.Site.Params.docs_version .image }}" alt="{{ .name }}" class="mh-100 mw-100">
      {{ if .website -}}
        </a>
      {{ end -}}
    </div>
  {{ end -}}
</div>

<script>
  (function () {
    'use strict'

    var backerDisplayed = 10

    function displaySponsors(sponsorList) {
      var sponsorListEl = document.getElementById('sponsorList')
      var output = []

      sponsorList.forEach(function (sponsor) {
        var sponsorAccount = sponsor.fromAccount

        output.push(
          '<div class="m-2 position-relative">',
          ' <div class="img-thumbnail mx-auto d-flex align-items-center justify-content-center overflow-hidden" style="width:100px; height: 100px;">',
          '  <img class="img-fluid d-block" src="' + sponsorAccount.imageUrl + '" alt="' + sponsorAccount.name + '">',
          ' </div>',
          ' <h3 class="h6 pt-2">',
        )

        if (sponsorAccount.website) {
          output.push('<a href="' + sponsorAccount.website + '" class="stretched-link text-reset">' + sponsorAccount.name + '</a>')
        } else {
          output.push(sponsorAccount.name)
        }

        output.push(
          ' </h3>',
          '</div>'
        )
      })

      sponsorListEl.innerHTML = output.join('')
    }

    function displayBackers(backerList) {
      var backerListEl = document.getElementById('backerList')
      var output = []

      backerList.forEach(function (backer) {
        var backerAccount = backer.fromAccount

        output.push(
          '<div class="m-1 position-relative">',
          ' <div class="img-thumbnail d-flex align-items-center justify-content-center overflow-hidden" style="width:50px; height: 50px;">'
        )

        if (backerAccount.website) {
          output.push(
            '<a href="' + backerAccount.website + '" class="stretched-link text-reset" title="' + backerAccount.name + '">'
          )
        }

        output.push('<img src="' + backerAccount.imageUrl + '" alt="' + backerAccount.name + '" class="img-fluid d-block">')

        if (backerAccount.website) {
          output.push('</a>')
        }

        output.push(
          ' </div>',
          '</div>',
        )
      })

      backerListEl.innerHTML = output.join('')
    }

    function requestOC(cb) {
      var ocURL = 'https://rest.opencollective.com/v2/bootstrap/orders/incoming/active'
      var xhr = new XMLHttpRequest()

      xhr.open('GET', ocURL, true)
      xhr.addEventListener('load', function () {
        if (xhr.readyState !== 4) {
          return
        }

        if (xhr.status === 200) {
          cb(JSON.parse(xhr.responseText), null)
        } else {
          cb(null, xhr.statusText)
        }
      })

      xhr.send()
    }

    (function () {
      requestOC(function (data) {
        var allBackerList = data.nodes
        var backerList = allBackerList.filter(function (backer) {
          return backer.tier.slug === 'backer'
        })
        var sponsorList = allBackerList.filter(function (backer) {
          return backer.tier.slug === 'sponsor'
        })

        // Sort by total amount donated
        sponsorList.sort(function (sponsor1, sponsor2) {
          return sponsor2.totalDonations.value - sponsor1.totalDonations.value
        })
        sponsorList = sponsorList.slice(0, backerDisplayed)

        displaySponsors(sponsorList)

        // Sort by total amount donated
        backerList.sort(function (backer1, backer2) {
          return backer2.totalDonations.value - backer1.totalDonations.value
        })
        backerList = backerList.slice(0, backerDisplayed)

        displayBackers(backerList)
      })
    })()
  })()
</script>
{{< /services.inline >}}
