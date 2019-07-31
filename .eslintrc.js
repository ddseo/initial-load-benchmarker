module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    "comma-dangle": ["error", {
      "arrays": "never",
      "imports": "never",
      "exports": "never",
      "functions": "never",
      "objects":"ignore"
    }],
    "prefer-destructuring": 0,
    "import/no-extraneous-dependencies": 0,
    "key-spacing": [
      "error",
      {
        align: {
          "beforeColon": true,
          "afterColon": true,
          "on": "colon"
        }
      }
    ],
    "no-multi-spaces": [
      "error",
      {
        exceptions: {
          "VariableDeclarator": true,
          "ImportDeclaration": true
        }
      }
    ],
    "eqeqeq": [
      "error",
      "smart"
    ],
    "no-underscore-dangle": 0,
    camelcase: 0,
    "comma-dangle": ["error", "always-multiline"],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-console": 0,
    "no-alert": 2,
    "no-trailing-spaces": [
      "error"
    ],
    "no-use-before-define": 0,
    "no-unused-vars": [
      "error",
      {
        "args": "none"
      }
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": 0,
  }
}
