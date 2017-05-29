{% callout danger %}
#### Asynchronous methods and transitions

All API methods are **asynchronous** and start a **transition**. They returns to the caller as soon as the transition is started but **before it ends**. In addition, a method call on a **transitioning component will be ignored**.

[See our Javascript documentation for more informations.]({{ site.baseurl }}/getting-started/javascript/#content)
{% endcallout %}
