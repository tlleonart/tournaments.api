/**** Jest config for ESM TypeScript ****/
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts)$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/__tests__/tsconfig.json',
      diagnostics: false
    }]
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@itbaf/tournaments-models$': '<rootDir>/__mocks__/tournaments-models.ts',
  },
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts']
};