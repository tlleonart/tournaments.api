process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/tournaments_test'
process.env.LOG_LEVEL = 'error'

jest.setTimeout(30000)

global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(), 
  warn: jest.fn(),
  error: console.error, 
}

const mockDate = new Date('2025-01-15T10:00:00.000Z')
global.Date = class extends Date {
  constructor(...args) {
    if (args.length === 0) {
      return mockDate
    }
    return new Date(...args)
  }
  
  static now() {
    return mockDate.getTime()
  }
}

jest.mock('@api/core-lib/db', () => ({
  getPrismaClient: jest.fn(() => ({
    
    client: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    apiKey: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    score: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    tournamentEdition: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    country: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    regionCountry: {
      findFirst: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $disconnect: jest.fn(),
  })),
  
  db: jest.fn(),
  disconnectPrisma: jest.fn(),
  checkDatabaseHealth: jest.fn(() => Promise.resolve(true)),
}))

jest.mock('@google-cloud/functions-framework', () => ({
  http: jest.fn(),
  getFunction: jest.fn(),
}))

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.restoreAllMocks()
})


global.testHelpers = {
  createMockRequest: (overrides = {}) => ({
    method: 'POST',
    headers: {},
    body: {},
    query: {},
    ...overrides,
  }),
  
  createMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    }
    return res
  },
  
  createTestApiKey: () => ({
    id: 'test-api-key-id',
    apiKeyHash: 'test-hash-123',
    clientId: 'test-client-id',
    enabled: true,
    client: {
      id: 'test-client-id',
      name: 'Test Client'
    }
  }),
  
  createTestTournament: () => ({
    id: 1,
    name: 'Test Tournament',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: 'ACTIVE',
    regionType: 'GLOBAL',
    tournaments: [{
      apiKeyId: 'test-api-key-id',
      regionId: 1,
    }]
  })
}

if (process.env.DEBUG_TESTS === 'true') {
  global.console = console
  beforeEach(() => {
    console.log(`🧪 Running test: ${expect.getState().currentTestName}`)
  })
}