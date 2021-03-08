module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js', 'public/*', 'next.config.js'],
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: { ecmaFeatures: { jsx: true } },
      settings: { react: { version: 'detect' } },
      env: { browser: true, node: true, es2021: true },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      plugins: ["prettier"],
      rules: {
        'prettier/prettier': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
      },
    },
  ],
};
