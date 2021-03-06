const actions = [];

export const routes = {
  get: {
    '/path': actions,
    '/nested/path': actions,
    '/nested/path/:id': actions
  },
  post: {
    '/path': actions
  },
  policy: {
    '/path': actions,
    '/nested/path': actions,
    '/nested/path/:id': actions
  },
  prefix: {
    '/path': 'path'
  }
};
