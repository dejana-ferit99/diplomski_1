const loginEndpoint =  require('../pageObjects/login');
const accountsEndpoint = require('../pageObjects/accountsOverview');
const accountByIDEndpoint =require('../pageObjects/accountByID');
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
    
    it("Get all bank accounts of the user by valid user ID", { tags: ['@flow1'] }, () => {
        accountsEndpoint.accountsOverview(apiUrl1, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            //console.log(accountID);
            apiUrl2 = `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}`;
            //console.log(apiUrl2);
          });
    });

    it("Get account by account ID", () => {
        accountByIDEndpoint.accountByID(apiUrl2).then((response) => {
            expect(response.status).to.eq(200);
            const accountByID = response.body; 
            expect(accountByID).to.have.property('id');
            expect(accountByID).to.have.property('customerId');
            expect(accountByID).to.have.property('type');
            expect(accountByID).to.have.property('balance');
          });
    });

    it("Get account by account ID, incorrect account ID", () => {

        accountByIDEndpoint.accountByID('https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/123').then((response) => {
            expect(response.status).to.eq(500);
        });

    });

    it("Get account by account ID, without account ID", () => {

        accountByIDEndpoint.accountByID('https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/').then((response) => {
            expect(response.status).to.eq(404);
        });

    });
});