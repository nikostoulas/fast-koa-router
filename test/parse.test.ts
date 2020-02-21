import * as assert from 'assert';
import { routes } from './routes.simple';
import { routes as routes1 } from './routes.nested';
import { routes as routes2 } from './routes.paths';
import { routes as routes3 } from './routes.backslash';
import { parse, handlePathVariables, getPathMethod, addPrefixMiddleware } from '../src/parse';

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

  describe('addPrefixMiddleware', function() {
    it('should handle path variables', function() {
      snapshot(handlePathVariables(addPrefixMiddleware(parse(routes), routes.prefix)));
    });

    it('should remove ending slash', function() {
      snapshot(handlePathVariables(addPrefixMiddleware(parse(routes3), routes3.prefix)));
    });

    it('should return routes for get', function() {
      assert.deepEqual(
        getPathMethod(handlePathVariables(addPrefixMiddleware(parse(routes), routes.prefix)), '/path', 'get'),
        {
          _matchedRoute: '/path',
          middleware: ['path']
        }
      );
    });

    it('should not add if prefix ends with /', function() {
      assert.deepEqual(
        getPathMethod(
          handlePathVariables(
            addPrefixMiddleware(
              parse({
                get: {
                  '/path': ['middleware']
                }
              }),
              { '/pa/': 'prefix' }
            )
          ),
          '/path',
          'get'
        ),
        {
          _matchedRoute: '/path',
          middleware: ['middleware']
        }
      );
    });

    // tslint:disable-next-line: quotemark
    it("should add prefix if it doesn't end with /", function() {
      assert.deepEqual(
        getPathMethod(
          handlePathVariables(
            addPrefixMiddleware(
              parse({
                get: {
                  '/path': ['middleware']
                }
              }),
              { '/pa': 'prefix' }
            )
          ),
          '/path',
          'get'
        ),
        {
          _matchedRoute: '/path',
          middleware: ['prefix', 'middleware']
        }
      );
    });

    it('should add prefix middleware to all matching routes', function() {
      snapshot(
        addPrefixMiddleware(
          {
            get: {
              '/nested/path/:id': {
                middleware: []
              },
              '/nested/path': {
                middleware: []
              },
              '/path': {
                middleware: []
              }
            }
          },
          {
            '/nested': ['nestedPrefix'],
            '/nested/path': 'nestedPathPrefix',
            '/nested/path/:param': 'nestedPathParamPrefix'
          }
        )
      );
    });
  });

  describe('route that matches every path', function() {
    it('should fallback to star routes', function() {
      let routes = handlePathVariables(
        addPrefixMiddleware(
          parse({
            get: {
              '/path': ['middleware'],
              '/path/1': ['one'],
              '/path/1/3/foo': ['foo'],
              '/path/*': ['star'],
              '/*': ['initialStar']
            }
          }),
          { '/path': 'prefix' }
        )
      );
      assert.deepEqual(getPathMethod(routes, '/path/1', 'get'), {
        _matchedRoute: '/path/1',
        middleware: ['prefix', 'one']
      });

      assert.deepEqual(getPathMethod(routes, '/path/foo', 'get'), {
        _matchedRoute: '/path/*',
        middleware: ['prefix', 'star']
      });

      assert.deepEqual(getPathMethod(routes, '/path/1/3', 'get'), {
        _matchedRoute: '/path/*',
        middleware: ['prefix', 'star']
      });

      assert.deepEqual(getPathMethod(routes, '/path/1/2', 'get'), {
        _matchedRoute: '/path/*',
        middleware: ['prefix', 'star']
      });

      assert.deepEqual(getPathMethod(routes, '/', 'get'), {
        _matchedRoute: '/*',
        middleware: ['initialStar'],
        params: {}
      });
    });

    it('should fallback to star routes', function() {
      let routes = handlePathVariables(
        addPrefixMiddleware(
          parse({
            get: {
              '/path': ['middleware'],
              '/path/1': ['one'],
              '/path/1/3/foo': ['foo'],
              '/path2/1/3/foo': ['foo'],
              '/path/*': ['star']
            }
          }),
          { '/path': 'prefix' }
        )
      );

      assert.deepEqual(getPathMethod(routes, '/path2/1', 'get'), {});
    });
  });
});
