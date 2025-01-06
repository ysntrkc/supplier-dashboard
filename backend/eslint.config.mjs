import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-duplicate-imports': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-empty': 'error',
      'no-extra-semi': 'error',
      'no-irregular-whitespace': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'object-curly-spacing': ['error', 'always'],
    },
  },
  js.configs.recommended,
];