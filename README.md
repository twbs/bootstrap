RealCrowd Fork of Bootstrap
===========================

## Setup Development

- `npm install`
- `npm run realcrowd-docs`

Need to use two terminals because of the structure to watch at multiple levels:

- Terminal 1: `npm run realcrowd-docs-serve`
- Terminal 2: `npm run watch`

To pull updates from twbs/bootstrap:

### Use UI [Stack Overflow](http://stackoverflow.com/questions/20984802/how-can-i-keep-my-fork-in-sync-without-adding-a-separate-remote/21131381#21131381)
- You might be able to update this from the github UI by clicking "Compare"
- Then click "Create pull request"
- Merge the generate pull request

### With console [Stack Overflow](http://stackoverflow.com/questions/7244321/how-do-i-update-a-github-forked-repository)
- Fork this repo locally.
- Fetch all branches of twbs/bootstrap: 'git fetch twbs'
- Make sure you are on v4-dev: 'git checkout v4-dev'
- Merge changes into v4-dev: 'git merge twbs/v4-dev'
- Push changes: 'git push origin v4-dev'


<p align="center">
  <a href="https://v4-alpha.getbootstrap.com">
    <img src="http://v4-alpha.getbootstrap.com/assets/brand/bootstrap-solid.svg" width=72 height=72>
  </a>

  <h3 align="center">Bootstrap</h3>

  <p align="center">
    Sleek, intuitive, and powerful front-end framework for faster and easier web development.
    <br>
    <a href="https://v4-alpha.getbootstrap.com"><strong>Visit Bootstrap &raquo;</strong></a>
  </p>
</p>

<br>




## Copyright and license

Code and documentation copyright 2011-2017 the [Bootstrap Authors](https://github.com/twbs/bootstrap/graphs/contributors) and [Twitter, Inc.](https://twitter.com) Code released under the [MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE). Docs released under [Creative Commons](https://github.com/twbs/bootstrap/blob/master/docs/LICENSE).
