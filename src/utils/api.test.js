import { apiGet, uploadFile } from './api';

describe('api utilities', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    global.fetch = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('uploadFile returns parsed data for successful JSON response', async () => {
    const responseData = { message: 'ok' };
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: jest.fn().mockResolvedValue(responseData),
    });

    const file = new File(['a,b'], 'audit.csv', { type: 'text/csv' });
    const result = await uploadFile(file);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: responseData, error: null });
  });

  it('uploadFile returns backend error text when request fails', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: jest.fn().mockResolvedValue({ error: 'Bad file format' }),
    });

    const file = new File(['oops'], 'audit.txt', { type: 'text/plain' });
    const result = await uploadFile(file);

    expect(result).toEqual({ data: null, error: 'Bad file format' });
  });

  it('apiGet returns network error when fetch throws', async () => {
    global.fetch.mockRejectedValue(new Error('offline'));

    const result = await apiGet('/api/health');

    expect(result).toEqual({
      data: null,
      error: 'Network error. Please check your connection.',
    });
  });
});
