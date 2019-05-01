import * as assert from 'assert';
import { routes } from './routes';
import { routes as routes1 } from './routes.1';
import { routes as routes2 } from './routes.2';
import { parse, handlePathVariables, getPathMethod } from '../src/parse';

describe('Parse', function() {
  it('output should be the same with different ways of routes', function() {
    assert.deepEqual(parse(routes), parse(routes1));
    assert.deepEqual(parse(routes), parse(routes2));
  });

  it('should handle path variables', function() {
    assert.deepEqual(handlePathVariables(parse(routes)), {
      '/health': { get: [] },
      '/api/v1/100': { get: [] },
      '/foo': { get: [] },
      '/foo/bar/3': { get: [] },
      '/api/v1/accounts/:id/rewards': { post: [] },
      '/api/v1/webhooks/events/:id/:sub/:action': { policy: [] },
      '/api': {
        '/v1': {
          '/accounts': { '/_VAR_': { paramName: 'id', '/rewards': { post: [] } } },
          '/webhooks': {
            '/events': {
              '/_VAR_': {
                paramName: 'id',
                '/_VAR_': {
                  paramName: 'sub',
                  '/_VAR_': {
                    paramName: 'action',
                    policy: []
                  }
                }
              }
            }
          }
        }
      }
    });
  });

  it('should return routes for get', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/foo/bar/3', 'get'), { route: [] });
  });

  it('should return routes for policy and path with params', function() {
    assert.deepEqual(
      getPathMethod(handlePathVariables(parse(routes)), '/api/v1/webhooks/events/id/sub/action', 'policy'),
      { route: [], params: { id: 'id', sub: 'sub', action: 'action' } }
    );
  });

  it('should return no route', function() {
    assert.deepEqual(
      getPathMethod(handlePathVariables(parse(routes)), '/api/v1/webhooks/events/id/sub/action/foo', 'policy'),
      {}
    );
  });
});
