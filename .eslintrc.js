module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'].map(require.resolve),
  rules: {
    'class-methods-use-this': 0,
    'no-return-assign': 0,
    'object-curly-spacing': [2, 'always'],
    semi: 2,
  },
};
