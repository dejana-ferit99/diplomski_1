class LoanEndpoint {

    accountsOverview(apiUrl2, authToken) {
      return cy.request({
          method: 'POST',
          url: apiUrl2,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
          }
      })
    }
  
  }
  
  module.exports = new LoanEndpoint();
  