# Simple Koa Router

## Installation

`npm install simple-koa-router`

## Usage

```js
const routes ={
    get: {
        '/path': actions,
        '/nested': {
        '/path': actions,
        '/path/:id': actions
        }
    },
    post: {
        '/path': actions
    },
    policy: {
        '/path': actions,
        '/nested': {
        '/path': actions,
        '/path/:id': actions
        }
    }
}

// or 

const routes = {
  '/path': {
    get: actions,
    post: actions,
    policy: actions
  },
  '/nested': {
    '/path': { get: actions, policy: actions },
    '/path/:id': { get: actions, policy: actions }
  }
}

// or

const routes = {
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
  }
}
```

```js
const Koa = require('koa');
const app = new Koa();
const { router } = require('simple-koa-router');

app.use(router(routes));
app.listen(8080);
```