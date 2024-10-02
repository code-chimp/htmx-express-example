import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: ['src/public/lib/*', 'src/types/index.d.ts'],
  },
  {
    rules: {
      '@typescript-eslint/array-type': ['warn', { default: 'array' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        2,
        { vars: 'local', args: 'after-used', argsIgnorePattern: '_' },
      ],
      'no-magic-numbers': [2, { ignore: [-1, 0, 1, 2, 10, 100, 1000] }],
      'no-unused-vars': 'off',
      'no-console': [
        'error',
        {
          allow: ['error', 'info', 'warn'],
        },
      ],
    },
  },
);
