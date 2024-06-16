class TransferEndpoint {

    transferFunds(apiUrl1, authToken) {
      return cy.request({
          method: 'POST',
          url: apiUrl1,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
          }
      });
    }
  
  }
  
  module.exports = new TransferEndpoint();