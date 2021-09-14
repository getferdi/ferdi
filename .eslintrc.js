module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: ['eslint-config-airbnb', 'plugin:unicorn/recommended'],
  plugins: ['jest'],
  settings: {
    react: {
      pragma: 'React', // Pragma to use, default to "React"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  },
  globals: {
    window: true,
    document: true,
    FormData: true,
    localStorage: true,
    navigator: true,
    Element: true,
    use: true,
    FileReader: true,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['airbnb-typescript', 'plugin:unicorn/recommended'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        // eslint
        'arrow-parens': 0,
        'array-callback-return': 1,
        'class-methods-use-this': 0,
        'consistent-return': 0,
        'function-paren-newline': 0,
        'implicit-arrow-linebreak': 0,
        'linebreak-style': 0,
        'max-len': 0,
        'no-confusing-arrow': 0,
        'no-console': 0,
        'no-param-reassign': 0,
        'no-restricted-syntax': 0,
        'no-return-assign': 1,
        'no-underscore-dangle': 0,
        'no-use-before-define': 0,
        'prefer-destructuring': 1,
        'object-curly-newline': 0,
        'operator-linebreak': 0,
        // @typescript-eslint
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/no-shadow': 0,
        '@typescript-eslint/no-unused-expressions': 0,
        // eslint-plugin-import
        'import/extensions': 0,
        'import/no-cycle': 1,
        'import/no-extraneous-dependencies': 0,
        'import/no-unresolved': 0,
        'import/prefer-default-export': 0,
        // eslint-plugin-react
        'react/destructuring-assignment': 0,
        'react/button-has-type': 0,
        'react/forbid-prop-types': 0,
        'react/jsx-curly-newline': 0,
        'react/jsx-no-bind': 0,
        'react/jsx-no-target-blank': 0,
        'react/jsx-props-no-spreading': 0,
        'react/no-deprecated': 1,
        'react/no-array-index-key': 0,
        'react/prefer-stateless-function': 0,
        'react/sort-comp': 0,
        'react/state-in-constructor': 0,
        'react/static-property-placement': 0,
        //  eslint-plugin-jsx-a11y
        'jsx-a11y/click-events-have-key-events': 1,
        'jsx-a11y/mouse-events-have-key-events': 1,
        'jsx-a11y/label-has-for': [
          2,
          {
            components: ['Label'],
            required: {
              every: ['id'],
            },
            allowChildren: false,
          },
        ],
        'jsx-a11y/no-static-element-interactions': 0,
        'jsx-a11y/no-noninteractive-element-interactions': 1,
        //  eslint-plugin-unicorn
        'unicorn/filename-case': 0,
        'unicorn/no-null': 0,
        'unicorn/no-useless-undefined': 0,
        'unicorn/prefer-module': 0,
        'unicorn/prevent-abbreviations': 0,
        'unicorn/prefer-node-protocol': 0,
        'unicorn/import-style': [
          2,
          {
            styles: {
              path: {
                named: true,
              },
            },
          },
        ],
        'unicorn/consistent-destructuring': 0,
      },
    },
  ],
  rules: {
    // eslint
    'arrow-parens': 0,
    'class-methods-use-this': 0,
    'consistent-return': 1,
    'implicit-arrow-linebreak': 0,
    indent: 0,
    'function-paren-newline': 0,
    'max-len': 0,
    'no-await-in-loop': 1,
    'no-console': [
      1,
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-param-reassign': 1,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
    'operator-linebreak': 0,
    'prefer-destructuring': 1,
    'object-curly-newline': 0,
    // eslint-plugin-import
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0, // various false positives, re-enable at some point
    'import/no-unresolved': 0,
    // eslint-plugin-react
    'react/forbid-prop-types': 1,
    'react/destructuring-assignment': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-filename-extension': 1,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-no-bind': 1,
    'react/jsx-props-no-spreading': 0,
    'react/prefer-stateless-function': 1,
    'react/prop-types': 0,
    'react/static-property-placement': 0,
    'react/state-in-constructor': 1,
    'react/sort-comp': 0,
    //  eslint-plugin-jsx-a11y
    'jsx-a11y/click-events-have-key-events': 1,
    'jsx-a11y/no-static-element-interactions': 1,
    'jsx-a11y/no-noninteractive-element-interactions': 1,
    //  eslint-plugin-unicorn
    'unicorn/filename-case': 0,
    'unicorn/no-null': 0,
    'unicorn/no-useless-undefined': 0,
    'unicorn/prefer-module': 0,
    'unicorn/prevent-abbreviations': 0,
    'unicorn/prefer-node-protocol': 0,
    'unicorn/import-style': [
      2,
      {
        styles: {
          path: {
            named: true,
          },
        },
      },
    ],
    'unicorn/consistent-destructuring': 0,
  },
};
