module.exports = {
      env: {
            commonjs: true,
            es6: true,
            node: true,
      },
      extends: ['airbnb-base'],
      globals: {
            Atomics: 'readonly',
            SharedArrayBuffer: 'readonly',
      },
      parserOptions: {
            ecmaVersion: 2018,
      },
      rules: {
            semi: ['error', 'always'],
            indent: ['error', 6],
            'arrow-parens': [2, 'as-needed'],
      },
};
