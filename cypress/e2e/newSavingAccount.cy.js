const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const newAccountEndpoint = require('../pageObjects/newAccount');
const config = require('../config/config');

describe('Parabank Login API Test', () => {
    const { username, password, authToken } = config;
    let userID;
    let apiUrl1;
    let apiUrls;
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
            apiUrls = `https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=1&fromAccountId=${accountID}`;
          });
    }); 

    it("Creating new saving account using valid data", () => {

        newAccountEndpoint.newAccountsOverview(apiUrls, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const newAccount = response.body; 
            expect(newAccount).to.have.property('id');
            expect(newAccount).to.have.property('customerId');
            expect(newAccount).to.have.property('type');
            expect(newAccount).to.have.property('balance');
        });

    }); 

    it("Creating new saving account using valid customerID, valid AccountType and invalid fromAccountId", () => {

        newAccountEndpoint.newAccountsOverview(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=1&fromAccountId=15`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    });

    it("Creating new saving account using valid customerID, valid AccountType and invalid fromAccountId", () => {

        newAccountEndpoint.newAccountsOverview(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=-1&fromAccountId=15`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    }); 

}); 