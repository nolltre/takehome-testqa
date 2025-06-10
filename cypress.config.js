const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.cp.pt/passageiros',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
