const maxComplexity = 7;
const maxParameters = 3;

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:fp/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
  ],
  plugins: [
    'fp',
    'prettier',
    'jsx-a11y',
    'unicorn',
    'jsdoc',
    'import',
    'promise',
    'sonarjs',
    'eslint-plugin-import-helpers',
    'array-plural',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        semi: true,
        useTabs: false,
        arrowParens: 'always',
      },
    ],
    '@typescript-eslint/indent': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'fp/no-unused-expression': 'off',
    'fp/no-nil': 'off',
    'fp/no-throw': 'off',
    'fp/no-let': 'warn',
    'fp/no-this': 'off',
    'fp/no-class': 'off',
    'fp/no-mutation': 'off',
    'fp/no-rest-parameters': 'off',
    'fp/no-mutating-methods': 'off',
    '@typescript-eslint/member-delimiter-style': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'warn',
      {
        ignoreProperties: true,
        ignoreParameters: true,
      },
    ],
    '@typescript-eslint/no-type-alias': ['error', { allowAliases: 'in-unions-and-intersections' }],
    'sonarjs/cognitive-complexity': ['warn', maxComplexity],
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/prefer-immediate-return': 'error',
    'unicorn/filename-case': 'off',
    'unicorn/explicit-length-check': 'warn',
    'unicorn/no-process-exit': 'warn',
    'unicorn/catch-error-name': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          args: false,
          props: false,
        },
      },
    ],
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-examples': 'warn',
    'jsdoc/check-indentation': 'warn',
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-syntax': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-types': 'warn',
    'jsdoc/no-undefined-types': 'warn',
    'jsdoc/require-description': 'warn',
    'jsdoc/require-description-complete-sentence': 'warn',
    'jsdoc/require-example': 'off',
    'jsdoc/require-hyphen-before-param-description': 'warn',
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/valid-types': 'warn',
    'import/no-unresolved': ['error', { caseSensitive: true }],
    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'always',
        groups: ['module', '/^@shared/', ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: false,
      },
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'always'],
    curly: 'error',
    'no-else-return': 'error',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'func-style': ['error', 'expression'],
    'default-param-last': ['error'],
    'max-params': ['error', maxParameters],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: true,
      },
    ],
    'no-return-assign': 'error',
    'promise/prefer-await-to-then': 'error',
    'promise/prefer-await-to-callbacks': 'error',
    'require-await': 'error',
    'default-case': 'error',
    'default-case-last': 'error',
    'no-unreachable': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'max-lines-per-function': ['warn', { max: 42, skipBlankLines: true, skipComments: true }],
    complexity: ['warn', maxComplexity],
    'eol-last': ['error', 'always'],
    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'error',
      {
        enforceConst: true,
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
        ignoreArrayIndexes: true,
      },
    ],
    'no-unused-expressions': 'error',
    'no-case-declarations': 'error',
    'import/no-default-export': 'error',
    'array-plural/array-plural': ['error', { allows: [] }],
    'unicorn/prevent-abbreviations': 'off'
  },
};
