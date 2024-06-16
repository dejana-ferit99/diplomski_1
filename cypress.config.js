//const { defineConfig } = require("cypress");

//module.exports = defineConfig({
//  e2e: {
//    setupNodeEvents(on, config) {
     // implement node event listeners here
//    },
// },
//});

// cypress.config.js
const { defineConfig } = require('cypress')
module.exports = defineConfig({
  e2e:
  {
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config);
      return config;
    }
  }
})