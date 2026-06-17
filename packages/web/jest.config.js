/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@purple-brock/burrow-tokens$': '<rootDir>/../tokens/src/index.ts',
    '^@purple-brock/burrow-core$': '<rootDir>/../core/src/index.ts',
  },
}
