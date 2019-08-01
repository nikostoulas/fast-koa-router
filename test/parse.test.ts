import * as assert from 'assert';
import { routes } from './routes.simple';
import { routes as routes1 } from './routes.nested';
import { routes as routes2 } from './routes.paths';
import { routes as routes3 } from './routes.backslash';
import { parse, handlePathVariables, getPathMethod } from '../src/parse';

describe('Parse', function() {
  it('output should be the same with different ways of routes', function() {
    assert.deepEqual(parse(routes), parse(routes1));
    assert.deepEqual(parse(routes), parse(routes2));
  });

  it('should handle path variables', function() {
    snapshot(handlePathVariables(parse(routes)));
  });

  it('should remove ending slash', function() {
    snapshot(handlePathVariables(parse(routes3)));
  });

  it('should return routes for get', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/path', 'get'), {
      _matchedRoute: '/path',
      middleware: []
    });
  });

  it('should return routes for policy and path with params', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/nested/path/id', 'policy'), {
      middleware: [],
      params: { id: 'id' },
      _matchedRoute: '/nested/path/:id'
    });
  });

  it('should return routes ignoring ending slash', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/nested/path/id/', 'policy'), {
      middleware: [],
      params: { id: 'id' },
      _matchedRoute: '/nested/path/:id'
    });
  });

  it('should return home route ignoring ending slash', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes3)), '/', 'get'), {
      middleware: [],
      _matchedRoute: ''
    });
  });

  it('should return no route if path does not match', function() {
    assert.deepEqual(getPathMethod(handlePathVariables(parse(routes)), '/nested/path/id/foo', 'policy'), {});
  });
});
