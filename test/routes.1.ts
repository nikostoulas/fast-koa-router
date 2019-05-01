const controllers = [];

export const routes = {
  get: {
    '/health': controllers,
    '/api': {
      '/v1': {
        '/100': controllers
      }
    },
    '/foo': controllers,
    '/foo/bar/3': controllers
  },
  post: {
    '/eps': {
      '/v1': {
        '/accounts': {
          '/:id': {
            '/rewards': controllers
          }
        }
      }
    }
  },
  policy: {
    '/api': {
      '/v1': {
        '/webhooks': {
          '/events': {
            '/:id': {
              '/:sub': {
                '/:action': controllers
              }
            }
          }
        }
      }
    }
  }
};
