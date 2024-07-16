const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const config = require('../config/config');

describe('Parabank Transactions For Account By Amount API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;
    let apiUrl2;
    let accountID;

    before('Should successfully login with correct credentials', () => {

        postRequest.login(username, password).then((response) => {
            expect(response.status).to.eq(200);
            const responseBody = postRequest.parseXmlToJson(response.body);
            expect(responseBody).to.have.property('customer');
            const customer = responseBody.customer;
            userID = customer.id._text.replace(/"/g, '');
            console.log(userID);
            apiUrl1 = `https://parabank.parasoft.com/parabank/services_proxy/bank/customers/${userID}/accounts`;
        });

    });

    it("Get all bank accounts of the user by valid user ID", () => {
        getRequest.getRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            console.log(accountID);
            apiUrl2 = `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/amount/500`;
            console.log(apiUrl2);
        });
    });

    it("Get transactions with valid ID account and amount", () => {

        getRequest.getRequest(apiUrl2).then((response) => {
            expect(response.status).to.eq(200);
        });

    });
    it("Get transactions with valid ID account and without amount", () => {

        getRequest.getRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/amount/`).then((response) => {
            expect(response.status).to.eq(404);
        });

    });
    it("Get transactions with invalid ID account and without amount", () => {

        getRequest.getRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/14/transactions/amount/`).then((response) => {
            expect(response.status).to.eq(404);
        });

    });
    it("Get transactions with invalid ID account and with amount", () => {

        getRequest.getRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/14/transactions/amount/500`).then((response) => {
            expect(response.status).to.eq(500);
        });

    });

});