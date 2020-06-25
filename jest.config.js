/** @format */

/** @typedef {import('ts-jest')} */
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/index.ts'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'index.[jt]sx?',
    '(mock|stub).[jt]sx?',
    '.json',
    '/testing/',
    '/tests/',
  ],
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.js',
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};

module.exports = config;
