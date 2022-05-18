module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 14,
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
  ],
  overrides: [
    {
      include: 'packages/fields/src/Controller.js',
      presets: ['@babel/preset-env'],
    },
  ],
};
