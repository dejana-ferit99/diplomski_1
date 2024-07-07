const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const config = require('../config/config');

describe('Parabank Login API Test', () => {
    const { username, password, authToken } = config;
    let userID;
    let apiUrl1;

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
    
    it("Get all bank accounts of the user by valid user ID",  { tags: ['@flow1'] }, () => {

        accountsEndpoint.accountsOverview(apiUrl1, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            expect(account).to.have.property('customerId');
            expect(account).to.have.property('type');
            expect(account).to.have.property('balance');
        });

    });

    it("Get all bank accounts of the user by valid user ID and without authorization", () => {

        accountsEndpoint.accountsOverview(apiUrl1, '').then((response) => {
            expect(response.status).to.eq(401);

        });

    });

    it("Get all bank accounts of the user by invalid user Id", () => {

        accountsEndpoint.accountsOverview('https://parabank.parasoft.com/parabank/services_proxy/bank/customers/123/accounts', authToken).then((response) => {
            expect(response.status).to.eq(500);

        });

    });

    it("Get all bank accounts without user Id", () => {

        accountsEndpoint.accountsOverview('https://parabank.parasoft.com/parabank/services_proxy/bank/customers/accounts', authToken).then((response) => {
            expect(response.status).to.eq(400);

        });

    });

});