import js from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'
import securityPlugin from 'eslint-plugin-security'

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest', // More future-safe than 2018
      sourceType: 'module',  // ✅ allows `import`/`export`
      globals: {
        process: 'readonly', // ✅ allows `process.env`
        jest: true,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      security: securityPlugin,
    },
    rules: {
      'no-console': 'error',
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'jest/expect-expect': 'off',
      'security/detect-object-injection': 'off',

      // Allow process.env
      'no-process-env': 'off',

      // Prettier formatting rules
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5',
          tabWidth: 4,
          semi: false,
          singleQuote: true,
        },
      ],
    },
  },
]
