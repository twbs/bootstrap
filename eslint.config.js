import eslintConfigXo from 'eslint-config-xo'
import unicorn from 'eslint-plugin-unicorn'
import importXPlugin from 'eslint-plugin-import-x'
import html from 'eslint-plugin-html'
import markdown from 'eslint-plugin-markdown'
import globals from 'globals'

const importRules = {
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'always'
    }
  ],
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'import/no-absolute-path': 'error',
  'import/no-amd': 'error',
  'import/no-cycle': [
    'error',
    {
      ignoreExternal: true
    }
  ],
  'import/no-duplicates': 'error',
  'import/no-extraneous-dependencies': 'error',
  'import/no-mutable-exports': 'error',
  'import/no-named-as-default': 'error',
  'import/no-named-as-default-member': 'error',
  'import/no-named-default': 'error',
  'import/no-self-import': 'error',
  'import/no-unassigned-import': [
    'error'
  ],
  'import/no-useless-path-segments': 'error',
  'import/order': 'error'
}

const localRules = {
  'arrow-body-style': 'off',
  'capitalized-comments': 'off',
  '@stylistic/comma-dangle': [
    'error',
    'never'
  ],
  ...importRules,
  '@stylistic/indent': [
    'error',
    2,
    {
      MemberExpression: 'off',
      SwitchCase: 1
    }
  ],
  'logical-assignment-operators': 'off',
  'max-params': [
    'warn',
    5
  ],
  '@stylistic/multiline-ternary': [
    'error',
    'always-multiline'
  ],
  'new-cap': [
    'error',
    {
      properties: false
    }
  ],
  'no-console': 'error',
  'no-negated-condition': 'off',
  '@stylistic/object-curly-spacing': [
    'error',
    'always'
  ],
  '@stylistic/operator-linebreak': [
    'error',
    'after'
  ],
  'prefer-object-has-own': 'off',
  'prefer-template': 'error',
  '@stylistic/semi': [
    'error',
    'never'
  ],
  strict: 'error',
  'unicorn/explicit-length-check': 'off',
  'unicorn/filename-case': 'off',
  'unicorn/no-anonymous-default-export': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/no-array-method-this-argument': 'off',
  'unicorn/no-null': 'off',
  'unicorn/no-typeof-undefined': 'off',
  'unicorn/no-unused-properties': 'error',
  'unicorn/numeric-separators-style': 'off',
  'unicorn/prefer-array-flat': 'off',
  'unicorn/prefer-at': 'off',
  'unicorn/prefer-dom-node-dataset': 'off',
  'unicorn/prefer-global-this': 'off',
  'unicorn/prefer-module': 'off',
  'unicorn/prefer-query-selector': 'off',
  'unicorn/prefer-spread': 'off',
  'unicorn/prefer-string-raw': 'off',
  'unicorn/prefer-string-replace-all': 'off',
  'unicorn/prefer-structured-clone': 'off',
  'unicorn/prevent-abbreviations': 'off',
  // Rules new/changed in ESLint 10 / updated plugins — disable to preserve old behaviour
  'import-x/no-anonymous-default-export': 'off',
  'import-x/no-extraneous-dependencies': 'off',
  'import-x/no-unassigned-import': 'off',
  'n/file-extension-in-import': 'off',
  'n/no-deprecated-api': 'off',
  'n/no-extraneous-import': 'off',
  'n/prefer-global/buffer': 'off',
  'n/prefer-global/process': 'off',
  'n/prefer-promises/fs': 'off',
  'no-shadow': 'off',
  'require-unicode-regexp': 'off',
  '@stylistic/indent-binary-ops': 'off',
  '@stylistic/curly-newline': 'off',
  '@stylistic/function-paren-newline': 'off',
  'unicorn/no-array-sort': 'off',
  'unicorn/prefer-classlist-toggle': 'off'
}

// Base config: xo/browser + unicorn + import-x for all JS/HTML/MD files
const xoBrowserConfigs = eslintConfigXo({ browser: true, space: false })
const xoBrowserConfig = xoBrowserConfigs.find(config =>
  config.files?.includes('**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,svelte,astro}')
) ?? xoBrowserConfigs[0]
const unicornConfig = unicorn.configs['flat/recommended']

const eslintConfig = [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      '**/*.min.js',
      '**/dist/**',
      '**/vendor/**',
      '_site/**',
      'site/public/**',
      'js/coverage/**',
      'site/static/sw.js',
      'site/static/docs/**/assets/sw.js',
      'site/layouts/partials/**',
      // TypeScript, declaration and Astro files are not linted
      '**/*.ts',
      '**/*.d.ts',
      '**/*.astro',
      // Meteor metadata file (uses unsupported eslint-env comment)
      'package.js',
      // Claude worktrees
      '.claude/worktrees/**'
    ]
  },

  // Base config for all JS files
  {
    ...xoBrowserConfig,
    plugins: {
      ...xoBrowserConfig.plugins,
      unicorn,
      import: importXPlugin
    },
    rules: {
      ...xoBrowserConfig.rules,
      ...unicornConfig.rules,
      ...localRules
    }
  },

  // build/** — node environment, no browser
  {
    files: ['build/**'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      sourceType: 'module'
    },
    rules: {
      'no-console': 'off',
      'unicorn/prefer-top-level-await': 'off'
    }
  },

  // js/** — ESM source
  {
    files: ['js/**'],
    languageOptions: {
      sourceType: 'module'
    }
  },

  // CJS files — Node.js environment, script mode
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs
      },
      sourceType: 'script'
    },
    rules: {
      strict: 'off',
      'unicorn/prefer-module': 'off'
    }
  },

  // js/tests/*.js + integration rollup configs — browser ESM
  {
    files: [
      'js/tests/integration/bundle*.js',
      'js/tests/integration/rollup*.js'
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      sourceType: 'module'
    }
  },

  // js/tests/unit/** — jasmine
  {
    files: ['js/tests/unit/**'],
    languageOptions: {
      globals: {
        ...globals.jasmine
      }
    },
    rules: {
      'no-console': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-add-event-listener': 'off'
    }
  },

  // js/tests/visual/** — HTML files with inline scripts
  {
    files: ['js/tests/visual/**'],
    plugins: {
      html
    },
    settings: {
      'html/html-extensions': ['.html']
    },
    rules: {
      'no-console': 'off',
      'no-new': 'off',
      'unicorn/no-array-for-each': 'off'
    }
  },

  // scss/tests/** — node, script mode
  {
    files: ['scss/tests/**'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      sourceType: 'script'
    }
  },

  // site/** — browser, script mode, older ecmaVersion
  {
    files: ['site/**'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      sourceType: 'script',
      parserOptions: {
        ecmaVersion: 2019
      }
    },
    rules: {
      'no-new': 'off',
      'unicorn/no-array-for-each': 'off',
      strict: 'off'
    }
  },

  // site specific module files
  {
    files: [
      'site/src/assets/application.js',
      'site/src/assets/partials/*.js',
      'site/src/assets/search.js',
      'site/src/assets/snippets.js',
      'site/src/assets/stackblitz.js',
      'site/src/plugins/*.js'
    ],
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2020
      }
    },
    // These files may have eslint-disable directives for the old import plugin
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  },

  // site/static/**/*.js — older scripts with 'use strict', not modules
  {
    files: ['site/static/**/*.js'],
    rules: {
      strict: 'off'
    }
  },

  // site cheatsheet/sidebars — module, no-unresolved off
  {
    files: [
      'site/src/assets/examples/cheatsheet/cheatsheet.js',
      'site/src/assets/examples/sidebars/sidebars.js'
    ],
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2020
      }
    },
    rules: {
      'import/no-unresolved': 'off'
    }
  },

  // Markdown files — use processor
  ...markdown.configs.recommended,

  // Markdown code blocks
  {
    files: ['**/*.md/*.js', '**/*.md/*.mjs'],
    rules: {
      'unicorn/prefer-node-protocol': 'off'
    }
  }
]

export default eslintConfig
