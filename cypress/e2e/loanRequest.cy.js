const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const loanEndpoint = require('../pageObjects/loanRequest');
const config = require('../config/config');

describe('Parabank Login API Test', () => {
    const { username, password, authToken } = config;
    let userID;
    let apiUrl1;
    let apiUrls;
    let apiUrli;
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
            apiUrls = `https://parabank.parasoft.com/parabank/services_proxy/bank/requestLoan?customerId=${userID}&amount=100&downPayment=10&fromAccountId=${accountID}`;
            apiUrli = `https://parabank.parasoft.com/parabank/services_proxy/bank/requestLoan?customerId=${userID}&amount=10000&downPayment=100&fromAccountId=${accountID}`;
        });
    }); 
    it("Send a loan request with sufficient funds", () => {

        loanEndpoint.accountsOverview(apiUrls, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const loanRequest = response.body; 
            expect(loanRequest).to.have.property('responseDate');
            expect(loanRequest).to.have.property('loanProviderName');
            expect(loanRequest).to.have.property('approved');
            expect(loanRequest).to.have.property('accountId');
        });

    }); 
    it("Send a loan request with insufficient downpayment", () => {

        loanEndpoint.accountsOverview(apiUrli, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const loanRequest = response.body; 
            expect(loanRequest).to.have.property('responseDate');
            expect(loanRequest).to.have.property('loanProviderName');
            expect(loanRequest).to.have.property('approved');
            expect(loanRequest).to.have.property('message');
            expect(loanRequest).to.have.property('accountId');
        });

    }); 
});