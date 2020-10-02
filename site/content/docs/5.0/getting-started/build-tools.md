---
layout: docs
title: Build tools
description: Learn how to use Bootstrap's included npm scripts to build our documentation, compile source code, run tests, and more.
group: getting-started
toc: true
---

## Tooling setup

Bootstrap uses [npm scripts](https://docs.npmjs.com/misc/scripts) for its build system. Our [package.json]({{< param repo >}}/blob/v{{< param current_version >}}/package.json) includes convenient methods for working with the framework, including compiling code, running tests, and more.

To use our build system and run our documentation locally, you'll need a copy of Bootstrap's source files and Node. Follow these steps and you should be ready to rock:

1. [Download and install Node.js](https://nodejs.org/en/download/), which we use to manage our dependencies.
2. Either [download Bootstrap's sources]({{< param "download.source" >}}) or fork [Bootstrap's repository]({{< param repo >}}).
3. Navigate to the root `/bootstrap` directory and run `npm install` to install our local dependencies listed in [package.json]({{< param repo >}}/blob/v{{< param current_version >}}/package.json).

When completed, you'll be able to run the various commands provided from the command line.

## Using npm scripts

Our [package.json]({{< param repo >}}/blob/v{{< param current_version >}}/package.json) includes numerous tasks for developing the project. Run `npm run` to see all the npm scripts in your terminal. **Primary tasks include:**

<table class="table">
  <thead>
    <tr>
      <th>Task</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>npm start</code>
      </td>
      <td>
        Compiles CSS and JavaScript, builds the documentation, and starts a local server.
      </td>
    </tr>
    <tr>
      <td>
        <code>npm run dist</code>
      </td>
      <td>
       Creates the <code>dist/</code> directory with compiled files. Requires <a href="https://sass-lang.com/">Sass</a>, <a href="https://github.com/postcss/autoprefixer">Autoprefixer</a>, and <a href="https://github.com/terser/terser">terser</a>.
      </td>
    </tr>
    <tr>
      <td>
        <code>npm test</code>
      </td>
      <td>
        Runs tests locally after running <code>npm run dist</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>npm run docs-serve</code>
      </td>
      <td>
        Builds and runs the documentation locally.
      </td>
    </tr>
  </tbody>
</table>

## Autoprefixer

Bootstrap uses [Autoprefixer][autoprefixer] (included in our build process) to automatically add vendor prefixes to some CSS properties at build time. Doing so saves us time and code by allowing us to write key parts of our CSS a single time while eliminating the need for vendor mixins like those found in v3.

We maintain the list of browsers supported through Autoprefixer in a separate file within our GitHub repository. See [.browserslistrc]({{< param repo >}}/blob/v{{< param current_version >}}/.browserslistrc) for details.

## Local documentation

Running our documentation locally requires the use of Hugo, which gets installed via the [hugo-bin](https://www.npmjs.com/package/hugo-bin) npm package. Hugo is a blazingly fast and quite extensible static site generator that provides us: basic includes, Markdown-based files, templates, and more. Here's how to get it started:

1. Run through the [tooling setup](#tooling-setup) above to install all dependencies.
2. From the root `/bootstrap` directory, run `npm run docs-serve` in the command line.
3. Open `http://localhost:9001/` in your browser, and voilà.

Learn more about using Hugo by reading its [documentation](https://gohugo.io/documentation/).


## lite-server local setup for bootstrap project
For running your project on lite-server(light-weight Web Server)
lite server is good choice for running your project on local system check official docs [lite-server](https://github.com/johnpapa/lite-server)
## Steps
* `mkdir ExampleProject` & include bootstrap4 CDN links in your .html files 
* Then Do `cd ExampleProject`
* install lite-server in respective directory through CMD/terminal `npm init -y` We use npm to initialize an empty project. The -y tells it to just use the defaults for any parameters.
* then do `npm install --save-dev lite-server`
* This installs the lite-server package and adds it to the devDependencies in our project’s package.json file.

`"devDependencies": {    "lite-server": "^2.3.0"  }`
you can check dependancies in `node_modules/ite-server `
* Run lite-server

In your package.json file, modify the scripts object. Replace the contents with an entry called start that runs lite-server, like this:

`"scripts": { "start": "lite-server"}`,
* `npm start` will run your project on http://localhost:3000/ port.

## Troubleshooting

Should you encounter problems with installing dependencies, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

[autoprefixer]: https://github.com/postcss/autoprefixer
