# Bootstrap CSS

This package provides the compiled Bootstrap CSS and JavaScript files.

## Install

Install the package with the .NET CLI:

```console
dotnet add package bootstrap
```

## Use the files

SDK-style projects expose the files at these paths:

- `wwwroot/css`
- `wwwroot/js`

Add the minified CSS and bundled JavaScript to your page:

```html
<link rel="stylesheet" href="/css/bootstrap.min.css">
<script src="/js/bootstrap.bundle.min.js"></script>
```

The JavaScript bundle includes Bootstrap’s JavaScript dependencies.

.NET Framework projects that use `packages.config` receive CSS files in `Content`.
They receive JavaScript files in `Scripts`.

## Other resources

- Read the [Bootstrap documentation](https://getbootstrap.com/).
- Report problems in the [Bootstrap issue tracker](https://github.com/twbs/bootstrap/issues).
- Read the [MIT license](https://github.com/twbs/bootstrap/blob/main/LICENSE).
