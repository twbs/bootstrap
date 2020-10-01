{% capture callout %}
#### Asynchronous methods and transitions

All API methods are **asynchronous** and start a **transition**. They return to the caller as soon as the transition is started but **before it ends**. In addition, a method call on a **transitioning component will be ignored**.

[See our JavaScript documentation for more information]({{ site.baseurl }}/docs/{{ site.docs_version }}/getting-started/javascript/#asynchronous-functions-and-transitions).
{% endcapture %}
{% include callout.html content=callout type="danger" %}
