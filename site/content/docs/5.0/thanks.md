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
  function displaySponsors(sponsorList) {
    var sponsorListEl = document.getElementById('sponsorList')
    var output = []

    sponsorList.forEach(function (sponsor) {
      output.push(
        '<div class="m-2 position-relative">',
        ' <div style="width:100px; height: 100px;" class="img-thumbnail d-flex align-items-center justify-content-center overflow-hidden">',
        '   <div class="w-100">',
        '    <img src="' + sponsor.avatar + '" alt="' + sponsor.name + '" class="mh-100 mw-100">',
        '   </div>',
        ' </div>',
        ' <h3 class="h6 pt-2">',
      )

      if (sponsor.website) {
        output.push('<a href="' + sponsor.website + '" class="stretched-link text-reset">' + sponsor.name + '</a>')
      } else {
        output.push(sponsor.name)
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
      output.push(
        '<div class="m-1 position-relative">',
        ' <div style="width:50px; height: 50px;" class="img-thumbnail d-flex align-items-center justify-content-center overflow-hidden">'
      )

      if (backer.website) {
        output.push(
          '<a href="' + backer.website + '" class="stretched-link text-reset" title="' + backer.name + '">'
        )
      }

      output.push('<img src="' + backer.avatar + '" alt="' + backer.name + '" class="mh-100 mw-100">')

      if (backer.website) {
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
    var ocURL = 'https://opencollective.com/api/groups/bootstrap/backers'
    var xhr = new XMLHttpRequest()

    xhr.open('GET', ocURL, true)
    xhr.onload = function () {
      if (xhr.readyState !== 4) {
        return
      }

      if (xhr.status === 200) {
        cb(JSON.parse(xhr.responseText), null)
      } else {
        cb(null, xhr.statusText)
      }
    }
    xhr.send()
  }

  (function () {
    requestOC(function (allBackerList, error) {
      var backerList = allBackerList.filter(function (backer) { return backer.tier === 'backer' })
      var sponsorList = allBackerList.filter(function (backer) { return backer.tier === 'sponsor' })

      // Sort by total amount donated
      sponsorList.sort(function (sponsor1, sponsor2) { return sponsor2.directDonations - sponsor1.directDonations })
      sponsorList = sponsorList.slice(0, 10)

      displaySponsors(sponsorList)

      // Sort by total amount donated
      backerList.sort(function (backer1, backer2) { return backer2.directDonations - backer1.directDonations })
      backerList = backerList.slice(0, 10)

      displayBackers(backerList)
    })
  })()
</script>
{{< /services.inline >}}
