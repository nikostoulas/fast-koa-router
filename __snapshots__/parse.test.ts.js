exports['Parse should handle path variables 1'] = {
  "policy": {
    "/path": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  },
  "post": {
    "/path": {
      "middleware": []
    }
  },
  "get": {
    "/path": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  }
}

exports['Parse should remove ending slash 1'] = {
  "policy": {
    "/path": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  },
  "post": {
    "/path": {
      "middleware": []
    }
  },
  "get": {
    "/path": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  }
}

exports['Parse addPrefixMiddleware should add prefix middleware to all matching routes 1'] = {
  "get": {
    "/nested/path/:id": {
      "middleware": [
        "nestedPrefix",
        "nestedPathPrefix",
        "nestedPathParamPrefix"
      ]
    },
    "/nested/path": {
      "middleware": [
        "nestedPrefix",
        "nestedPathPrefix"
      ]
    },
    "/path": {
      "middleware": []
    }
  }
}

exports['Parse addPrefixMiddleware should handle path variables 1'] = {
  "policy": {
    "/path": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  },
  "post": {
    "/path": {
      "middleware": [
        "path"
      ]
    }
  },
  "get": {
    "/path": {
      "middleware": [
        "path"
      ]
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  }
}

exports['Parse addPrefixMiddleware should remove ending slash 1'] = {
  "policy": {
    "/path": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  },
  "post": {
    "/path": {
      "middleware": [
        "path"
      ]
    }
  },
  "get": {
    "/path": {
      "middleware": [
        "path"
      ]
    },
    "/nested/path": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "middleware": [],
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        }
      }
    }
  }
}
