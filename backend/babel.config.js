const pkg = require("./package.json");

module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: pkg.engines.node,
        },
      },
    ],
  ],
};
