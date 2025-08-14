import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

const common = {
  plugins: {
      '@stylistic': stylistic
    },
  rules: {
    'require-await': 'warn',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-empty-pattern': 'warn',
    'no-return-await': 'error',

    '@stylistic/quotes': [2, 'single', { allowTemplateLiterals: 'always' }],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/indent': ['error', 2],
    '@stylistic/no-multi-spaces': 'error',

    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
  }
}

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: 'tsconfig.app.json'
      }
    },
    ...common
  },
  {
    files: ['tests/**/*.ts', "playwright.config.ts"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: 'tsconfig.tests.json'
      }
    },
    ...common
  },
])
