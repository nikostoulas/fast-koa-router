import { Router } from '../src/router';
import { routes } from './routes.simple';
import * as assert from 'assert';

describe('Router', function() {
  let router: Router;
  before(function() {
    router = new Router(routes);
  });

  it('gets policy', function() {
    const route = router.getPolicy({ path: '/nested/path' });
    assert.deepEqual(route, []);
  });

  it('gets method and sets state', function() {
    const ctx = { path: '/nested/path/10', method: 'GET' };
    const route = router.getRouteAndSetState(ctx);
    assert.deepEqual(route, []);
    assert.deepEqual((ctx as any).params, { id: '10' });
  });
});
