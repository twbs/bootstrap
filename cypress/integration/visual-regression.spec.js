const packageJson = require('../../package.json');

/**
 * NOTE: Cypress commands do not return real Promises even though
 * they have a .then() and you should NOT use async/await syntax
 * https://github.com/cypress-io/cypress/issues/1417
 */

describe('Visual Regression Tests', () => {
  // The docs path has the MAJOR.MINOR version in it, but not the patch
  const version = packageJson.version.split('.').slice(0, 2).join('.');
  const baseUrl = `http://localhost:9001/docs/${version}/components/`;
  const examples = [
    'alerts',
    'badge',
    'breadcrumb',
    'buttons',
    'button-group',
    'card',
    // 'carousel', // Some of the carousels automatically slide in a nondeterministic way
    'collapse',
    'dropdowns',
    'forms',
    'input-group',
    'jumbotron',
    'list-group',
    'modal',
    'navs',
    'navbar',
    'pagination',
    'popovers',
    'progress',
    'scrollspy',
    // 'tooltips' // Tooltips don't show up without hover so not meaningful to test this way
  ];

  examples.forEach(example => {
    it(example, () => {
      const url = `${baseUrl}${example}/`;
      cy.visit(url)
        .get('.bd-example').then($nodes => {
          for (let i = 0, l = $nodes.length; i < l; i++) {
            const $node = $nodes.eq(i);
            const className = `bd-example-${i}`;
            $node.get(0).classList.add(className);
            const subtitle = $node.prevAll('h3:first,h2:first').first().text();

            cy.get(`.${className}`)
              .eyesOpen({
                appName: 'Bootstrap',
                testName: `${example} - ${subtitle} - ${i}`,
                browser: [{
                  name: 'chrome',
                  width: 800,
                  height: 600,
                }]
              })
              .eyesCheckWindow({ sizeMode: 'selector', selector: `.${className}` })
              .eyesClose();
          }
        });
    });
  });
});
