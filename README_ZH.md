<p align="center">
  <a href="https://getbootstrap.com/">
    <img src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png" alt="Bootstrap 徽标" width="200" height="165">
  </a>
</p>

<h3 align="center">Bootstrap</h3>

<p align="center">
  简洁、直观且强大的前端框架，助您快速便捷地进行网页开发。
  <br>
  <a href="https://getbootstrap.com/docs/5.3/"><strong>浏览 Bootstrap 文档 »</strong></a>
  <br>
  <br>
  <a href="https://github.com/twbs/bootstrap/issues/new?assignees=-&labels=bug&template=bug_report.yml">报告错误</a>
  ·
  <a href="https://github.com/twbs/bootstrap/issues/new?assignees=&labels=feature&template=feature_request.yml">功能请求</a>
  ·
  <a href="https://themes.getbootstrap.com/">主题商店</a>
  ·
  <a href="https://blog.getbootstrap.com/">官方博客</a>
</p>


## Bootstrap 5

我们的默认分支用于 Bootstrap 5 版本的开发。如需查看 Bootstrap 4 的说明文档、文档和源代码，请切换到 [`v4-dev` 分支](https://github.com/twbs/bootstrap/tree/v4-dev)。


## 目录

- [快速开始](#快速开始)
- [项目状态](#项目状态)
- [包含内容](#包含内容)
- [错误报告与功能请求](#错误报告与功能请求)
- [文档](#文档)
- [贡献指南](#贡献指南)
- [社区交流](#社区交流)
- [版本管理](#版本管理)
- [项目创建者](#项目创建者)
- [致谢](#致谢)
- [版权与许可](#版权与许可)


## 快速开始

多种快速启动方式供您选择：

- [下载最新版本](https://github.com/twbs/bootstrap/archive/v5.3.3.zip)
- 克隆仓库：`git clone https://github.com/twbs/bootstrap.git`
- 使用 [npm](https://www.npmjs.com/) 安装：`npm install bootstrap@v5.3.3`
- 使用 [yarn](https://yarnpkg.com/) 安装：`yarn add bootstrap@v5.3.3`
- 使用 [Composer](https://getcomposer.org/) 安装：`composer require twbs/bootstrap:5.3.3`
- 使用 [NuGet](https://www.nuget.org/) 安装：CSS 版本：`Install-Package bootstrap` Sass 版本：`Install-Package bootstrap.sass`

阅读[入门指南](https://getbootstrap.com/docs/5.3/getting-started/introduction/)获取框架内容、模板示例等信息。


## 项目状态

[![构建状态](https://img.shields.io/github/actions/workflow/status/twbs/bootstrap/js.yml?branch=main&label=JS%20测试&logo=github)](https://github.com/twbs/bootstrap/actions/workflows/js.yml?query=workflow%3AJS+branch%3Amain)
[![npm 版本](https://img.shields.io/npm/v/bootstrap?logo=npm&logoColor=fff)](https://www.npmjs.com/package/bootstrap)
[![Gem 版本](https://img.shields.io/gem/v/bootstrap?logo=rubygems&logoColor=fff)](https://rubygems.org/gems/bootstrap)
[![Meteor Atmosphere](https://img.shields.io/badge/meteor-twbs%3Abootstrap-blue?logo=meteor&logoColor=fff)](https://atmospherejs.com/twbs/bootstrap)
[![Packagist 预发布版](https://img.shields.io/packagist/vpre/twbs/bootstrap?logo=packagist&logoColor=fff)](https://packagist.org/packages/twbs/bootstrap)
[![NuGet](https://img.shields.io/nuget/vpre/bootstrap?logo=nuget&logoColor=fff)](https://www.nuget.org/packages/bootstrap/absoluteLatest)
[![测试覆盖率](https://img.shields.io/coveralls/github/twbs/bootstrap/main?logo=coveralls&logoColor=fff)](https://coveralls.io/github/twbs/bootstrap?branch=main)
[![CSS Gzip 大小](https://img.badgesize.io/twbs/bootstrap/main/dist/css/bootstrap.min.css?compression=gzip&label=CSS%20gzip%20大小)](https://github.com/twbs/bootstrap/blob/main/dist/css/bootstrap.min.css)
[![CSS Brotli 大小](https://img.badgesize.io/twbs/bootstrap/main/dist/css/bootstrap.min.css?compression=brotli&label=CSS%20Brotli%20大小)](https://github.com/twbs/bootstrap/blob/main/dist/css/bootstrap.min.css)
[![JS Gzip 大小](https://img.badgesize.io/twbs/bootstrap/main/dist/js/bootstrap.min.js?compression=gzip&label=JS%20gzip%20大小)](https://github.com/twbs/bootstrap/blob/main/dist/js/bootstrap.min.js)
[![JS Brotli 大小](https://img.badgesize.io/twbs/bootstrap/main/dist/js/bootstrap.min.js?compression=brotli&label=JS%20Brotli%20大小)](https://github.com/twbs/bootstrap/blob/main/dist/js/bootstrap.min.js)
[![Open Collective 支持者](https://img.shields.io/opencollective/backers/bootstrap?logo=opencollective&logoColor=fff)](#支持者)
[![Open Collective 赞助商](https://img.shields.io/opencollective/sponsors/bootstrap?logo=opencollective&logoColor=fff)](#赞助商)


## 包含内容

下载包中包含以下目录和文件，按资源类型分类并提供编译版与压缩版。

<details>
  <summary>下载内容结构</summary>

  ```text
  bootstrap/
  ├── css/
  │   ├── bootstrap-grid.css
  │   ├── bootstrap-grid.css.map
  │   ├── bootstrap-grid.min.css
  │   ├── bootstrap-grid.min.css.map
  │   ├── bootstrap-grid.rtl.css
  │   ├── bootstrap-grid.rtl.css.map
  │   ├── bootstrap-grid.rtl.min.css
  │   ├── bootstrap-grid.rtl.min.css.map
  │   ├── bootstrap-reboot.css
  │   ├── bootstrap-reboot.css.map
  │   ├── bootstrap-reboot.min.css
  │   ├── bootstrap-reboot.min.css.map
  │   ├── bootstrap-reboot.rtl.css
  │   ├── bootstrap-reboot.rtl.css.map
  │   ├── bootstrap-reboot.rtl.min.css
  │   ├── bootstrap-reboot.rtl.min.css.map
  │   ├── bootstrap-utilities.css
  │   ├── bootstrap-utilities.css.map
  │   ├── bootstrap-utilities.min.css
  │   ├── bootstrap-utilities.min.css.map
  │   ├── bootstrap-utilities.rtl.css
  │   ├── bootstrap-utilities.rtl.css.map
  │   ├── bootstrap-utilities.rtl.min.css
  │   ├── bootstrap-utilities.rtl.min.css.map
  │   ├── bootstrap.css
  │   ├── bootstrap.css.map
  │   ├── bootstrap.min.css
  │   ├── bootstrap.min.css.map
  │   ├── bootstrap.rtl.css
  │   ├── bootstrap.rtl.css.map
  │   ├── bootstrap.rtl.min.css
  │   └── bootstrap.rtl.min.css.map
  └── js/
      ├── bootstrap.bundle.js
      ├── bootstrap.bundle.js.map
      ├── bootstrap.bundle.min.js
      ├── bootstrap.bundle.min.js.map
      ├── bootstrap.esm.js
      ├── bootstrap.esm.js.map
      ├── bootstrap.esm.min.js
      ├── bootstrap.esm.min.js.map
      ├── bootstrap.js
      ├── bootstrap.js.map
      ├── bootstrap.min.js
      └── bootstrap.min.js.map
  ```
</details>

我们提供编译后的 CSS 和 JS 文件 (`bootstrap.*`)，以及压缩版本 (`bootstrap.min.*`)。[源映射文件](https://web.dev/articles/source-maps) (`bootstrap.*.map`) 可用于浏览器开发者工具。捆绑的 JS 文件 (`bootstrap.bundle.js` 和压缩版 `bootstrap.bundle.min.js`) 包含 [Popper](https://popper.js.org/docs/v2/)。


## 错误报告与功能请求

发现错误或有功能建议？请先阅读[问题提交指南](https://github.com/twbs/bootstrap/blob/main/.github/CONTRIBUTING.md#using-the-issue-tracker)并搜索现有议题。如果问题尚未被提出，请[新建议题](https://github.com/twbs/bootstrap/issues/new/choose)。


## 文档

Bootstrap 的文档位于仓库根目录，使用 [Hugo](https://gohugo.io/) 构建，并托管于 GitHub Pages：<https://getbootstrap.com/>。您也可以在本地运行文档。

文档搜索由 [Algolia DocSearch](https://docsearch.algolia.com/) 提供支持。

### 本地运行文档

1. 运行 `npm install` 安装 Node.js 依赖（包括 Hugo 站点生成器）
2. 运行 `npm run test`（或特定 npm 脚本）重新构建 CSS/JS 文件及文档资源
3. 在根目录 `/bootstrap` 下运行 `npm run docs-serve`
4. 浏览器访问 `http://localhost:9001/` 即可查看

通过阅读 [Hugo 文档](https://gohugo.io/documentation/)了解更多用法。

### 历史版本文档

所有历史版本文档可在 <https://getbootstrap.com/docs/versions/> 查看。

[历史版本发布包](https://github.com/twbs/bootstrap/releases)及其文档也可下载。


## 贡献指南

请阅读[贡献指南](https://github.com/twbs/bootstrap/blob/main/.github/CONTRIBUTING.md)了解问题提交、代码规范等开发指引。

如果提交包含 JavaScript 修改，必须包含[相关单元测试](https://github.com/twbs/bootstrap/tree/main/js/tests)。所有 HTML/CSS 代码需符合 [代码规范指南](https://github.com/mdo/code-guide)。

编辑器配置详见 [.editorconfig](https://github.com/twbs/bootstrap/blob/main/.editorconfig)，支持常见编辑器插件。更多信息请访问 <https://editorconfig.org/>。


## 社区交流

获取最新动态并与维护者及社区成员交流：

- 关注 Twitter [@getbootstrap](https://twitter.com/getbootstrap)
- 订阅[官方博客](https://blog.getbootstrap.com/)
- 参与 [GitHub Discussions](https://github.com/twbs/bootstrap/discussions)
- 加入 [社区 Discord](https://discord.gg/bZUvakRU3M) 或 [Bootstrap 子版块](https://www.reddit.com/r/bootstrap/)
- IRC 频道：在 `irc.libera.chat` 服务器加入 `#bootstrap`
- 开发问题可至 Stack Overflow 的 [`bootstrap-5` 标签](https://stackoverflow.com/questions/tagged/bootstrap-5)下提问
- 开发者发布 npm 包时建议使用 `bootstrap` 关键字以提升可见性


## 版本管理

为保持版本透明与向后兼容，Bootstrap 遵循[语义化版本规范](https://semver.org/)。我们会尽可能遵守这些规则。

各版本更新日志请查看 [GitHub 发布页面](https://github.com/twbs/bootstrap/releases)，[官方博客](https://blog.getbootstrap.com/)的版本公告包含重要变更摘要。


## 项目创建者

**Mark Otto**

- <https://twitter.com/mdo>
- <https://github.com/mdo>

**Jacob Thornton**

- <https://twitter.com/fat>
- <https://github.com/fat>


## 致谢

<a href="https://www.browserstack.com/">
  <img src="https://live.browserstack.com/images/opensource/browserstack-logo.svg" alt="BrowserStack" width="192" height="42">
</a>

感谢 [BrowserStack](https://www.browserstack.com/) 提供真实浏览器测试环境！

<a href="https://www.netlify.com/">
  <img src="https://www.netlify.com/v3/img/components/full-logo-light.svg" alt="Netlify" width="147" height="40">
</a>

感谢 [Netlify](https://www.netlify.com/) 提供部署预览服务！


## 赞助商

通过赞助支持本项目，您的 Logo 将展示于此并链接至贵网站。[成为赞助商](https://opencollective.com/bootstrap#sponsor)

[![OC 赞助商 0](https://opencollective.com/bootstrap/sponsor/0/avatar.svg)](https://opencollective.com/bootstrap/sponsor/0/website)
[![OC 赞助商 1](https://opencollective.com/bootstrap/sponsor/1/avatar.svg)](https://opencollective.com/bootstrap/sponsor/1/website)
[![OC 赞助商 2](https://opencollective.com/bootstrap/sponsor/2/avatar.svg)](https://opencollective.com/bootstrap/sponsor/2/website)
[![OC 赞助商 3](https://opencollective.com/bootstrap/sponsor/3/avatar.svg)](https://opencollective.com/bootstrap/sponsor/3/website)
[![OC 赞助商 4](https://opencollective.com/bootstrap/sponsor/4/avatar.svg)](https://opencollective.com/bootstrap/sponsor/4/website)
[![OC 赞助商 5](https://opencollective.com/bootstrap/sponsor/5/avatar.svg)](https://opencollective.com/bootstrap/sponsor/5/website)
[![OC 赞助商 6](https://opencollective.com/bootstrap/sponsor/6/avatar.svg)](https://opencollective.com/bootstrap/sponsor/6/website)
[![OC 赞助商 7](https://opencollective.com/bootstrap/sponsor/7/avatar.svg)](https://opencollective.com/bootstrap/sponsor/7/website)
[![OC 赞助商 8](https://opencollective.com/bootstrap/sponsor/8/avatar.svg)](https://opencollective.com/bootstrap/sponsor/8/website)
[![OC 赞助商 9](https://opencollective.com/bootstrap/sponsor/9/avatar.svg)](https://opencollective.com/bootstrap/sponsor/9/website)


## 支持者

感谢所有支持者！🙏 [成为支持者](https://opencollective.com/bootstrap#backer)

[![支持者](https://opencollective.com/bootstrap/backers.svg?width=890)](https://opencollective.com/bootstrap#backers)


## 版权与许可

代码和文档版权归 [Bootstrap 贡献者](https://github.com/twbs/bootstrap/graphs/contributors)所有（2011-2025）。代码遵循 [MIT 许可](https://github.com/twbs/bootstrap/blob/main/LICENSE)，文档遵循 [知识共享许可](https://creativecommons.org/licenses/by/3.0/)。
