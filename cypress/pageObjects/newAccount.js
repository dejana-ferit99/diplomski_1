class NewAccountEndpoint {

    newAccountsOverview(apiUrl, authToken) {
      return cy.request({
          method: 'POST',
          url: apiUrl,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
          }
      })
    }
  
  }
  
  module.exports = new NewAccountEndpoint();