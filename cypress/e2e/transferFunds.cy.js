const convert = require('xml-js');
const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const transferEndpoint =  require('../pageObjects/transferFunds');
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
            apiUrl2 = `https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=${accountID}&toAccountId=${accountID}&amount=500`;
        });
    });

    it("Transfer money from one account to another using valid fromAccountId, toAccountId and amount", () => {

        transferEndpoint.transferFunds(apiUrl2, authToken).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.equal(`Successfully transferred $500 from account #${accountID} to account #${accountID}`);
        });

    });

    it("Transfer money from one account to another, without amount", () => {

        transferEndpoint.transferFunds(`https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=${accountID}&toAccountId=${accountID}&amount=`, authToken).then((response) => {
            expect(response.status).to.eq(400);
        });

    });

    it("Transfer money from one account to another when fromAccountId is invalid, toAccountId is valid, with amount", () => {

        transferEndpoint.transferFunds(`https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=15&toAccountId=${accountID}&amount=500`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    });

    it("Transfer money from one account to another when fromAccountId is valid, toAccountId is invalid, with amount", () => {

        transferEndpoint.transferFunds(`https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=${accountID}&toAccountId=15&amount=500`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    });

    it("Transfer money from one account to another when fromAccountId is valid, toAccountId is invalid, without amount", () => {

        transferEndpoint.transferFunds(`https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=${accountID}&toAccountId=15&amount=`, authToken).then((response) => {
            expect(response.status).to.eq(400);
        });

    });

    it("Transfer money from one account to another when fromAccountId is invalid, toAccountId is invalid, with amount", () => {

        transferEndpoint.transferFunds(`https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=15&toAccountId=15&amount=500`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    });

    it("Transfer money from one account to another when fromAccountId is invalid, toAccountId is invalid, without amount", () => {

        transferEndpoint.transferFunds(`https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=15&toAccountId=15&amount=`, authToken).then((response) => {
            expect(response.status).to.eq(400);
        });

    });

    it("Transfer money from one account to another when fromAccountId is valid, toAccountId is invalid, without amount", () => {

        transferEndpoint.transferFunds(`https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=${accountID}&toAccountId=15&amount=`, authToken).then((response) => {
            expect(response.status).to.eq(400);
        });

    });
});
