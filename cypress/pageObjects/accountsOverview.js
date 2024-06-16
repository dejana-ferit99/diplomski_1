class AccountsEndpoint {

  accountsOverview(apiUrl, authToken) {
    return cy.request({
        method: 'GET',
        url: apiUrl,
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        }
    })
  }

}

module.exports = new AccountsEndpoint();
