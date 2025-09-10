/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  projects: [
    {
      displayName: 'core-lib',
      testMatch: ['<rootDir>/packages/core-lib/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
    },
    {
      displayName: 'getScores',
      testMatch: ['<rootDir>/apps/getScores/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
    },
    {
      displayName: 'setScores',
      testMatch: ['<rootDir>/apps/setScores/**/*.test.ts'], 
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
    }
  ],
  
  collectCoverageFrom: [
    'apps/*/src/**/*.ts',
    'packages/*/src/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/__mocks__/**',
    '!**/__tests__/**'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',       
    'lcov',       
    'html',       
    'json-summary'
  ],
  

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  

  moduleNameMapping: {
    '^@api/core-lib$': '<rootDir>/packages/core-lib/src/index',
    '^@api/core-lib/(.*)$': '<rootDir>/packages/core-lib/src/$1'
  },
  

  maxWorkers: '50%',
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  

  verbose: false,
  silent: false,
  

  transformIgnorePatterns: [
    'node_modules/(?!(@google-cloud/functions-framework)/)'
  ],
  

  testTimeout: 30000,
  

  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
}