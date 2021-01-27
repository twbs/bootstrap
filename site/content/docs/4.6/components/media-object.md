---
layout: docs
title: Media object
description: Documentation and examples for Bootstrap's media object to construct highly repetitive components like blog comments, tweets, and the like.
group: components
toc: true
---

## Example

The [media object](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/) helps build complex and repetitive components where some media is positioned alongside content that doesn't wrap around said media. Plus, it does this with only two required classes thanks to flexbox.

Below is an example of a single media object. Only two classes are required—the wrapping `.media` and the `.media-body` around your content. Optional padding and margin can be controlled through [spacing utilities]({{< docsref "/utilities/spacing" >}}).

{{< example >}}
<div class="media">
  {{< placeholder width="64" height="64" class="mr-3" >}}
  <div class="media-body">
    <h5 class="mt-0">Media heading</h5>
    <p>Will you do the same for me? It's time to face the music I'm no longer your muse. Heard it's beautiful, be the judge and my girls gonna take a vote. I can feel a phoenix inside of me. Heaven is jealous of our love, angels are crying from up above. Yeah, you take me to utopia.</p>
  </div>
</div>
{{< /example >}}

{{< callout warning >}}
##### Flexbug #12: Inline elements aren't treated as flex items

Internet Explorer 10-11 do not render inline elements like links or images (or `::before` and `::after` pseudo-elements) as flex items. The only workaround is to set a non-inline `display` value (e.g., `block`, `inline-block`, or `flex`). We suggest using `.d-flex`, one of our [display utilities]({{< docsref "/utilities/display" >}}), as an easy fix.

**Source:** [Flexbugs on GitHub](https://github.com/philipwalton/flexbugs#flexbug-12)
{{< /callout >}}

## Nesting

Media objects can be infinitely nested, though we suggest you stop at some point. Place nested `.media` within the `.media-body` of a parent media object.

{{< example >}}
<div class="media">
  {{< placeholder width="64" height="64" class="mr-3" >}}
  <div class="media-body">
    <h5 class="mt-0">Media heading</h5>
    <p>Standing on the frontline when the bombs start to fall. Heaven is jealous of our love, angels are crying from up above. Can't replace you with a million rings. Boy, when you're with me I'll give you a taste. There’s no going back. Before you met me I was alright but things were kinda heavy. Heavy is the head that wears the crown.</p>

    <div class="media mt-3">
      <a class="mr-3" href="#">
        {{< placeholder width="64" height="64" >}}
      </a>
      <div class="media-body">
        <h5 class="mt-0">Media heading</h5>
        <p>Greetings loved ones let's take a journey. Yes, we make angels cry, raining down on earth from up above. Give you something good to celebrate. I used to bite my tongue and hold my breath. I'm ma get your heart racing in my skin-tight jeans. As I march alone to a different beat. Summer after high school when we first met. You're so hypnotizing, could you be the devil? Could you be an angel? It's time to bring out the big balloons. Thought that I was the exception. Bikinis, zucchinis, Martinis, no weenies.</p>
      </div>
    </div>
  </div>
</div>
{{< /example >}}

## Alignment

Media in a media object can be aligned with flexbox utilities to the top (default), middle, or end of your `.media-body` content.

{{< example >}}
<div class="media">
  {{< placeholder width="64" height="64" class="align-self-start mr-3" >}}
  <div class="media-body">
    <h5 class="mt-0">Top-aligned media</h5>
    <p>I’m gon’ put her in a coma. You give a hundred reasons why, and you say you're really gonna try. So I sat quietly, agreed politely. Suiting up for my crowning battle. And on my 18th Birthday we got matching tattoos. So très chic, yeah, she's a classic. I am ready for the road less traveled.</p>
    <p>I'm walking on air (tonight). But down to earth. You're original, cannot be replaced. But in another life I would be your girl. We drove to Cali and got drunk on the beach. We can dance, until we die, you and I, will be young forever. Saw you downtown singing the Blues.</p>
  </div>
</div>
{{< /example >}}

{{< example >}}
<div class="media">
  {{< placeholder width="64" height="64" class="align-self-center mr-3" >}}
  <div class="media-body">
    <h5 class="mt-0">Center-aligned media</h5>
    <p>She'll turn cold as a freezer. At the eh-end of it all. Stinging like a bee I earned my stripes. Bikinis, zucchinis, Martinis, no weenies. I hope you got a healthy appetite. We can dance, until we die, you and I, will be young forever. We're living the life. We're doing it right. Word on the street, you got somethin' to show me, me.</p>
    <p class="mb-0">Wanna see the show in 3D, a movie. They say, be afraid you're not like the others, futuristic lover. Open up your heart. So I sat quietly, agreed politely. Last Friday night. Yeah, you're lucky if you're on her plane. I'll be your gift, give you something good to celebrate.</p>
  </div>
</div>
{{< /example >}}

{{< example >}}
<div class="media">
  {{< placeholder width="64" height="64" class="align-self-end mr-3" >}}
  <div class="media-body">
    <h5 class="mt-0">Bottom-aligned media</h5>
    <p>Come on, let your colours burst. I can feel this light that's inside of me. All night they're playing, your song. From Tokyo to Mexico, to Rio. There’s no going back. But down to earth. Magical, colorful, Mr. Mystery, ee. Different DNA, they don't understand you.</p>
    <p class="mb-0">But down to earth. She's got that, je ne sais quoi, you know it. I can see the writing on the wall. The boys break their necks try'na to creep a little sneak peek. Take me, ta-ta-take me. Open up your heart. Thought that I was the exception. Boom, boom, boom. Venice beach and Palm Springs, summertime is everything. Bring the beat back. (This is how we do)</p>
  </div>
</div>
{{< /example >}}

## Order

Change the order of content in media objects by modifying the HTML itself, or by adding some custom flexbox CSS to set the `order` property (to an integer of your choosing).

{{< example >}}
<div class="media">
  <div class="media-body">
    <h5 class="mt-0 mb-1">Media object</h5>
    <p>I know there will be sacrifice but that's the price. Are you brave enough to let me see your peacock? Be your teenage dream tonight. Uh-huh, I see you. There’s no going back. Yeah, we maxed our credit cards and got kicked out of the bar. So let me get you in your birthday suit. You may fall in love when you meet her. Had the world in the palm of your hands. Don't let the greatness get you down, oh, oh yeah. Now we talking astrology, getting our nails did, all Japanese-y. Make me your Aphrodite.</p>
  </div>
  {{< placeholder width="64" height="64" class="ml-3" >}}
</div>
{{< /example >}}

## Media list

Because the media object has so few structural requirements, you can also use these classes on list HTML elements. On your `<ul>` or `<ol>`, add the `.list-unstyled` to remove any browser default list styles, and then apply `.media` to your `<li>`s. As always, use spacing utilities wherever needed to fine tune.

{{< example >}}
<ul class="list-unstyled">
  <li class="media">
    {{< placeholder width="64" height="64" class="mr-3" >}}
    <div class="media-body">
      <h5 class="mt-0 mb-1">List-based media object</h5>
      <p>All my girls vintage Chanel baby. So you can have your cake. Tonight, tonight, tonight, I'm walking on air. Slowly swallowing down my fear, yeah yeah. Growing fast into a bolt of lightning. So hot and heavy, 'Til dawn. That fairy tale ending with a knight in shining armor. Heavy is the head that wears the crown.</p>
    </div>
  </li>
  <li class="media my-4">
    {{< placeholder width="64" height="64" class="mr-3" >}}
    <div class="media-body">
      <h5 class="mt-0 mb-1">List-based media object</h5>
      <p>Maybe a reason why all the doors are closed. Cause once you’re mine, once you’re mine. Be your teenage dream tonight. Heavy is the head that wears the crown. It's not even a holiday, nothing to celebrate. A perfect storm, perfect storm.</p>
    </div>
  </li>
  <li class="media">
    {{< placeholder width="64" height="64" class="mr-3" >}}
    <div class="media-body">
      <h5 class="mt-0 mb-1">List-based media object</h5>
      <p>Are you brave enough to let me see your peacock? There’s no going back. This is the last time you say, after the last line you break. At the eh-end of it all.</p>
    </div>
  </li>
</ul>
{{< /example >}}
