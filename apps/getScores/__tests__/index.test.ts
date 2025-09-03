import { jest } from '@jest/globals';
import { __setDbImpl, db as mockDb } from '@itbaf/tournaments-models';

let getScores: any;

beforeAll(async () => {
  await import('../src');
  getScores = (globalThis as any).__getScores;
});

function createRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('getScores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __setDbImpl(undefined);
  });

  test('returns items with pagination and calls db with correct args', async () => {
    const items = [{ id: 1, amount: 100, playTime: 10 }];
    const total = 42;

    const findMany: any = (jest.fn() as any).mockResolvedValue(items);
    const count: any = (jest.fn() as any).mockResolvedValue(total);
    __setDbImpl({ score: { findMany, count } });

    const req: any = {
      method: 'GET',
      query: {
        page: '2',
        pageSize: '5',
        countryId: '7',
        tournamentEditionId: '9',
        userId: 'user-123',
      },
    };
    const res = createRes();

    await getScores(req, res);

    expect(mockDb).toHaveBeenCalledTimes(2); // once for findMany, once for count

    expect(findMany).toHaveBeenCalledWith({
      where: { countryId: 7, tournamentEditionId: 9, userId: 'user-123' },
      skip: (2 - 1) * 5,
      take: 5,
      orderBy: [{ amount: 'desc' }, { playTime: 'asc' }],
      include: {
        country: true,
        edition: { include: { scoreCriteria: true, tournaments: true } },
      },
    });
    expect(count).toHaveBeenCalledWith({ where: { countryId: 7, tournamentEditionId: 9, userId: 'user-123' } });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ items, total, page: 2, pageSize: 5 });
  });

  test('returns 400 when validation fails (page < 1)', async () => {
    const findMany = jest.fn();
    const count = jest.fn();
    __setDbImpl({ score: { findMany, count } });

    const req: any = { method: 'GET', query: { page: '0' } };
    const res = createRes();

    await getScores(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('error');
    expect(payload.error).toHaveProperty('fieldErrors');
    expect(findMany).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });

  test('returns 500 when db throws an error', async () => {
    __setDbImpl({ score: { findMany: ((jest.fn() as any).mockRejectedValue(new Error('db fail')) as any), count: (jest.fn() as any) } });

    const req: any = { method: 'GET', query: { page: '1', pageSize: '2' } };
    const res = createRes();

    // const originalError = console.error;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      // keep printing to console
      // originalError(...args);
    });

    try {
      await getScores(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      const payload = res.json.mock.calls[0][0];
      expect(payload).toMatchObject({ error: 'internal_error' });
      expect(typeof payload.detail).toBe('string');

      expect(errorSpy).toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });

  test('builds where only with provided filters', async () => {
    const items: any[] = [];
    const findMany: any = (jest.fn() as any).mockResolvedValue(items);
    const count: any = (jest.fn() as any).mockResolvedValue(0);
    __setDbImpl({ score: { findMany, count } });

    // only userId provided
    const req: any = { query: { userId: 'u1' } };
    const res = createRes();

    await getScores({ ...req, method: 'GET' }, res);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'u1' },
        skip: 0,
        take: 20,
      })
    );
  });

  test('returns 405 and sets Allow header when method is not GET', async () => {
    const req: any = { query: {}, method: 'POST' };
    const res = createRes();

    await getScores(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET');
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });
});
