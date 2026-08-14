import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_|pageContext',
          varsIgnorePattern: '^_|pageContext',
          destructuredArrayIgnorePattern: '^_|pageContext',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
