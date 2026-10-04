import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.backups/**',
      '.impeccable/**',
      'public/**',
      'vendor/**',
      'footer-scene/**',
      'scripts/**',
      'tests/**',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/**/*.tsx'],
    plugins: { 'react-hooks': hooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' },
  },
  {
    files: ['src/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
        Lenis: 'readonly',
      },
    },
    rules: { 'no-constant-condition': 'error' },
  },
  { files: ['src/lib/effectScope.ts'], rules: { '@typescript-eslint/no-this-alias': 'off' } },
);
