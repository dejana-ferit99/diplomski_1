const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const transactionsEndpoint = require('../pageObjects/transactionsByDate');
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
            //If user is new user, date at the end of this url should be changed
            apiUrl2 = `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/onDate/07-07-2024`;
        });

    });  

    it("Fetch transactions for specific date for account", () => {

        transactionsEndpoint.transactionsByDate(apiUrl2, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const transfer = response.body[0]; 
            expect(transfer).to.have.property('id');
            expect(transfer).to.have.property('accountId');
            expect(transfer).to.have.property('date');
            expect(transfer).to.have.property('amount');
            expect(transfer).to.have.property('description');
        });

    });

    it("Fetch transactions for specific date (transactions for this date does not exist) for account", () => {

        transactionsEndpoint.transactionsByDate(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/onDate/3-23-2024`, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const transfer = response.body[0]; 
            expect(transfer).to.have.property('id');
            expect(transfer).to.have.property('accountId');
            expect(transfer).to.have.property('date');
            expect(transfer).to.have.property('amount');
            expect(transfer).to.have.property('description');
        });

    });

    it("Fetch transactions for invalid account ID", () => {

        transactionsEndpoint.transactionsByDate(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/15/transactions/onDate/5-19-2024`, authToken).then((response) => {
            expect(response.status).to.eq(400);
        });

    });
    it("Fetch transactions without specific date for account", () => {

        transactionsEndpoint.transactionsByDate(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/15/transactions/onDate/`, authToken).then((response) => {
            expect(response.status).to.eq(404);
        });

    });
});

