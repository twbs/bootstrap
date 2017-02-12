module.exports = {
  options: {
    dir: '_gh_pages',
    commit: true,
    push: true,
    message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
  },
  pages: {
    options: {
      remote: 'git@github.com:twbs/derpstrap.git',
      branch: 'gh-pages'
    }
  }
}
