class BillEndpoint {

    payBill(apiUrl1, authToken, billDataBody) {
      return cy.request({
          method: 'POST',
          url: apiUrl1,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
          },
          body: billDataBody
      });
    }
  
  }
  
  module.exports = new BillEndpoint();