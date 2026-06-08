/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@badger-burrow/tokens$': '<rootDir>/../tokens/src/index.ts',
    '^@badger-burrow/core$': '<rootDir>/../core/src/index.ts',
    '^react-native$': '<rootDir>/src/__mocks__/react-native.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        strict: true,
      },
      diagnostics: false,
    }],
  },
}
