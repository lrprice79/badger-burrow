/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@badger-eco/burrow-tokens$': '<rootDir>/../tokens/src/index.ts',
  },
}

