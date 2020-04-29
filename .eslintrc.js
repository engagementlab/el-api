module.exports = {
    env: {
        es6: true,
    },
    extends: [
        'airbnb',
        'eslint-config-prettier'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        semi: ['error', 'always']
    }
};