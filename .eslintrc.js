module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  parserOptions: {
    ecmaVersion: 2020
  }
}
