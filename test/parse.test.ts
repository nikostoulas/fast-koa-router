import * as assert from 'assert';
import { routes } from './routes.simple';
import { routes as routes1 } from './routes.nested';
import { routes as routes2 } from './routes.paths';
import { parse, handlePathVariables, getPathMethod } from '../src/parse';

describe('Parse', function() {
  it('output should be the same with different ways of routes', function() {
    assert.deepEqual(parse(routes), parse(routes1));
    assert.deepEqual(parse(routes), parse(routes2));
  });

  it('should handle path variables', function() {
    assert.deepEqual(handlePathVariables(parse(routes)), {
      '/path': { policy: [], post: [], get: [] },
      '/nested/path': { policy: [], get: [] },
      '/nested/path/:id': { policy: [], get: [] },
      '/nested': { '/path': { '/_VAR_': { paramName: 'id', policy: [], get: [] } } }
    });
  });

  it('should return routes for get', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/path', 'get'), { route: [] });
  });

  it('should return routes for policy and path with params', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/nested/path/id', 'policy'), {
      route: [],
      params: { id: 'id' }
    });
  });

  it('should return no route if path does not match', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/nested/path/id/foo', 'policy'), {});
  });
});
