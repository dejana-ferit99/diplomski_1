class GetRequest {

    getRequest(apiUrl) {
      return cy.request({
          method: 'GET',
          url: apiUrl,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' 
          }
      })
    }
    getRequestNoAutorization(apiUrl) {
      return cy.request({
          method: 'GET',
          url: apiUrl,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json'
          }
      })
    }
  }
  
  module.exports = new GetRequest();