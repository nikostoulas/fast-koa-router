import { Router } from '../src/router';
import { routes } from './routes';
import * as assert from 'assert';

describe('Router', function() {
  let router: Router;
  before(function() {
    router = new Router(routes);
  });

  it('gets policy', function() {
    const route = router.getPolicy({ path: '/api/v1/webhooks/events/id/sub/action' });
    assert.deepEqual(route, []);
  });

  it('gets method and sets state', function() {
    const ctx = { path: '/api/v1/accounts/10/rewards', method: 'POST' };
    const route = router.getRouteAndSetState(ctx);
    assert.deepEqual(route, []);
    assert.deepEqual((ctx as any).params, { id: '10' });
  });
});
