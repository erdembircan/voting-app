import Server from '../../build/server/server';
import request from 'supertest';

describe('Server', () => {
  it('should render start page', (done) => {
    const app = new Server(1000)._app;
    request(app)
      .get('/')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
  it('should render custom page not found hbs', (done) => {
    const app = new Server(100)._app;
    request(app)
      .get('/some_invalid_url')
      .then((res) => {
        expect(res.text.includes('Page not found')).toBeTruthy();
        done();
      });
  });
});
