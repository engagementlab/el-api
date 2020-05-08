module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'eslint-config-prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    semi: ['error', 'always'],
    indent: ['error', 4],
    'arrow-parens': [2, 'as-needed'],
    'operator-linebreak': ['error', 'after'],
    'comma-dangle': ['error', {
      objects: 'always'
    }],
  },
};