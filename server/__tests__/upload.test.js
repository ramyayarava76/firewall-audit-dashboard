const request = require('supertest');
const app = require('../index');

describe('Firewall API', () => {
  it('returns health status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('returns 400 when file is not provided', async () => {
    const res = await request(app).post('/api/upload');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No file uploaded.');
  });

  it('processes CSV upload and returns summary', async () => {
    const csv = [
      'timestamp,action,source_ip,dest_ip,protocol,port',
      '2026-06-15T10:00:00Z,ALLOW,10.0.0.1,10.0.0.2,TCP,443',
      '2026-06-15T10:01:00Z,DENY,10.0.0.3,10.0.0.4,TCP,22',
    ].join('\n');

    const res = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from(csv), 'audit.csv');

    expect(res.status).toBe(200);
    expect(res.body.filename).toBe('audit.csv');
    expect(res.body.summary.total).toBe(2);
    expect(res.body.summary.allowed).toBe(1);
    expect(res.body.summary.blocked).toBe(1);
    expect(Array.isArray(res.body.entries)).toBe(true);
    expect(res.body.entries).toHaveLength(2);
  });

  it('rejects unsupported extensions', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('malicious'), 'audit.exe');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Unsupported file type');
  });
});
