exports['Middleware route should be called and state should be changed 1'] = {
  "path": "/foo/bar/3",
  "method": "GET",
  "params": {},
  "_matchedRoute": "/foo/bar/3",
  "body": "body",
  "next": true
}

exports['Middleware routes and policy should be called but not next 1'] = {
  "path": "/foo/bar/3",
  "method": "GET",
  "params": {
    "id": "bar"
  },
  "_matchedRoute": "/foo/:id/3",
  "policy": true,
  "body": "body",
  "state": "state"
}

exports['Middleware if nothing matches next is called 1'] = {
  "path": "/foo/bar/not-found",
  "method": "GET",
  "params": {},
  "next": true
}

exports['Middleware routes and policy and prefix should be called but not next 1'] = {
  "path": "/foo/bar/3",
  "method": "GET",
  "params": {
    "id": "bar"
  },
  "_matchedRoute": "/foo/:id/3",
  "policy": true,
  "prefix": true,
  "body": "body",
  "state": "state"
}

exports['Middleware it also exports routes 1'] = {
  "policy": {
    "/foo/bar/3": {
      "middleware": [
        null
      ]
    },
    "/foo": {
      "/bar": {
        "/3": {
          "middleware": [
            null
          ]
        }
      }
    }
  },
  "get": {
    "/foo/:id/3": {
      "middleware": [
        null
      ]
    },
    "/foo": {
      "/_VAR_": {
        "paramName": "id",
        "/3": {
          "middleware": [
            null
          ]
        }
      }
    }
  }
}
