const convert = require('xml-js');
class PostRequest {

    constructor() {
        this.baseUrl = 'http://parabank.parasoft.com/parabank/services';
      }
    
      login(username, password) {
        const loginUrl = `${this.baseUrl}/bank/login/${username}/${password}`;
        return cy.request({
          method: 'POST',
          url: loginUrl,
          failOnStatusCode: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    
      parseXmlToJson(responseBody) {
        const jsonResponse = convert.xml2json(responseBody, { compact: true, spaces: 4 });
        return JSON.parse(jsonResponse);
      }

    postRequest(apiUrl) {
      return cy.request({
          method: 'POST',
          url: apiUrl,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '
          }
      })
    }

    postRequestWithBodyData(apiUrl, billDataBody) {
        return cy.request({
            method: 'POST',
            url: apiUrl,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '
            },
            body: billDataBody
        })
      }

    postRequestNoAutorization(apiUrl) {
      return cy.request({
          method: 'POST',
          url: apiUrl,
          failOnStatusCode: false,
          headers: {
              'Content-Type': 'application/json'
          }
      })
    }
  
  }
  
  module.exports = new PostRequest();
  