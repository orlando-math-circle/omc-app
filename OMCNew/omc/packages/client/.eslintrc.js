module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  plugins: ['nuxt'],
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    'vue/custom-event-name-casing': [
      'error',
      { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] },
    ],
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'any',
          component: 'always',
        },
      },
    ],
    'vue/component-name-in-template-casing': [
      'warn',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['/^v-/', 'nuxt', 'nuxt-link', 'client-only'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}
