const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const billEndpoint = require('../pageObjects/payBill');
const config = require('../config/config');

describe('Parabank Login API Test', () => {
    const { username, password, authToken } = config;
    let userID;
    let apiUrl1;
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
        accountsEndpoint.accountsOverview(apiUrl1, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            console.log(accountID);
            apiUrl1 =  `https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=200`;
        });
    });

    it("Pay bill with valid accountId and amount using valid body data", () => {
        cy.fixture('billDataBody').then((data) => {
            billEndpoint.payBill(apiUrl1, authToken, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(200);
                const account = response.body; 
                expect(account).to.have.property('payeeName');
                expect(account).to.have.property('amount');
                expect(account).to.have.property('accountId');
            });
        });

    });

    it("Pay bill with valid accountId and amount without body data", () => {

        cy.fixture('billDataBody').then((data) => {
            billEndpoint.payBill(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=`, authToken, data.billDataBody[1]).then((response) => {
                expect(response.status).to.eq(400);
            });
        });

    });

    it("Pay bill with valid accountId and without amount using valid body data", () => {

        cy.fixture('billDataBody').then((data) => {
            billEndpoint.payBill(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=`, authToken, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(400);
            });
        });

    });

    it("Pay bill with invalid accountId and amount using valid body data", () => {

        cy.fixture('billDataBody').then((data) => {
            billEndpoint.payBill(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=15&amount=`, authToken, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(400);
            });
        });

    });

    it("Pay bill with uncompleted body data (no accountNumber)", () => {

        cy.fixture('billDataBody').then((data) => {
            billEndpoint.payBill(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=200`, authToken, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

    });

});