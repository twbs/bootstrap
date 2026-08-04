# Bootstrap Sass

This package provides the Bootstrap Sass source and compiled JavaScript files.
It does not compile Sass into CSS.

## Install

Install the package with the .NET CLI:

```console
dotnet add package bootstrap.sass
```

You can also use the NuGet Package Manager Console:

```powershell
Install-Package bootstrap.sass
```

## Compile the Sass source at build

Use a Sass compiler that supports Dart Sass. Write the generated CSS to a public path such as `wwwroot/css`.

Set `GeneratePathProperty="true"` on the `bootstrap.sass` package reference.
NuGet then creates the `$(Pkgbootstrap_sass)` MSBuild property.

The Bootstrap Sass entry point is at this path:

```text
$(Pkgbootstrap_sass)\contentFiles\any\any\Styles\bootstrap.scss
```

Set your compiler load path to this directory:

```text
$(Pkgbootstrap_sass)\contentFiles\any\any\Styles
```

Use the [Bootstrap Sass guide](https://getbootstrap.com/docs/6.0/customize/sass/) to customize Bootstrap.

## Copy Sass for runtime compilation

A runtime compiler needs the Sass files in the application output.
Add this item to your project file:

```xml
<ItemGroup>
  <None Include="$(Pkgbootstrap_sass)\contentFiles\any\any\Styles\**\*.scss"
        Link="Styles\bootstrap\%(RecursiveDir)%(Filename)%(Extension)"
        CopyToOutputDirectory="PreserveNewest"
        CopyToPublishDirectory="PreserveNewest" />
</ItemGroup>
```

Use `Styles/bootstrap` as a compiler load path at runtime.
Do not serve that directory as static web content.

## Install a Sass compiler

These community packages can compile Sass without Node.js:

- [EmbeddedSass.Net](https://github.com/gumbarros/EmbeddedSass.Net)
- [AspNetCore.SassCompiler](https://github.com/koenvzeijl/AspNetCore.SassCompiler)

They both support build time and runtime compilations.

Follow the selected compiler’s documentation for its current setup.

### 


## Use the JavaScript

SDK-style projects expose the compiled JavaScript at `wwwroot/js`.
Add the bundle to your page:

```html
<script src="/js/bootstrap.bundle.min.js"></script>
```

## Migrate from Bootstrap 5

Bootstrap 6 stores Sass below `contentFiles/any/any/Styles` in the package.
Bootstrap 5 stored Sass below `contentFiles/any/any/wwwroot/scss`.
Update custom package paths when you upgrade.

## Other resources

- Read the [Bootstrap documentation](https://getbootstrap.com/).
- Report problems in the [Bootstrap issue tracker](https://github.com/twbs/bootstrap/issues).
- Read the [MIT license](https://github.com/twbs/bootstrap/blob/main/LICENSE).
