const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 390,
    viewportHeight: 844,
    supportFile: false,
  },
});
