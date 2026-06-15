/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@badger-eco/burrow-tokens$': '<rootDir>/../tokens/src/index.ts',
    '^@badger-eco/burrow-core$': '<rootDir>/../core/src/index.ts',
  },
}
