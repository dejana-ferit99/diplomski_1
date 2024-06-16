class TransactionsForAccountEndpoint {

    transactionsForAccountByAmount(apiUrl1, authToken) {
      return cy.request({
          method: 'GET',
          url: apiUrl1,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
          }
      });
    }
  
  }
  
  module.exports = new TransactionsForAccountEndpoint();