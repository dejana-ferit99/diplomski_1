const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const transactionsForAmountEndpoint = require('../pageObjects/transactionsForAccountByAmount');
const config = require('../config/config');

describe('Parabank Login API Test', () => {
    const { username, password, authToken } = config;
    let userID;
    let apiUrl1;
    let apiUrl2;
    let accountID;

    before('Should successfully login with correct credentials', () => {

        loginEndpoint.login(username, password).then((response) => {
            expect(response.status).to.eq(200);
            const responseBody = loginEndpoint.parseXmlToJson(response.body);
            expect(responseBody).to.have.property('customer');
            const customer = responseBody.customer;
            userID = customer.id._text.replace(/"/g, '');
            console.log(userID);
            apiUrl1 = `https://parabank.parasoft.com/parabank/services_proxy/bank/customers/${userID}/accounts`;
        });

    });

    it("Get all bank accounts of the user by valid user ID", () => {
        accountsEndpoint.accountsOverview(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            console.log(accountID);
            apiUrl2 = `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/amount/500`;
            console.log(apiUrl2);
        });
    });

    it("Create transactions with valid ID account and amount", () => {

        transactionsForAmountEndpoint.transactionsForAccountByAmount(apiUrl2, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const transactions = response.body[0]; 
            expect(transactions).to.have.property("id");
            expect(transactions).to.have.property("accountId");
            expect(transactions).to.have.property("type");
            expect(transactions).to.have.property("date");
            expect(transactions).to.have.property("amount");
            expect(transactions).to.have.property("description");
        });

    });
    it("Create transactions with valid ID account and without amount", () => {

        transactionsForAmountEndpoint.transactionsForAccountByAmount(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/amount/`, authToken).then((response) => {
            expect(response.status).to.eq(404);
        });

    });
    it("Create transactions with invalid ID account and without amount", () => {

        transactionsForAmountEndpoint.transactionsForAccountByAmount(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/14/transactions/amount/`, authToken).then((response) => {
            expect(response.status).to.eq(404);
        });

    });
    it("Create transactions with invalid ID account and with amount", () => {

        transactionsForAmountEndpoint.transactionsForAccountByAmount(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/14/transactions/amount/500`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    });

});