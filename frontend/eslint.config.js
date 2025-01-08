import reactPlugin from 'eslint-plugin-react'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'

const { configs: reactConfigs } = reactPlugin
const { configs: jsxA11yConfigs } = jsxA11yPlugin

export default [
  {
    ignores: ['node_modules', 'dist', 'build']
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      jsx: true
    },
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactConfigs.recommended.rules,
      ...jsxA11yConfigs.recommended.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error'
    }
  }
]