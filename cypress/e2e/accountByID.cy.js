const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const apiNonStatic = require('../pageObjects/ApiNonStatic');
const config = require('../config/config');


describe('Parabank Account API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;
    let apiUrl2;
    let accountID;
    const invalidID = apiNonStatic.generateRandomString(10);

    before('Login with correct credentials', () => {
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
    
    it("Get all bank accounts of the user by valid user ID", { tags: ['@flow1'] }, () => {
        getRequest.getRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            apiUrl2 = `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}`;
          });
    });

    it("Get account by account ID", () => {
        getRequest.getRequest(apiUrl2).then((response) => {
            expect(response.status).to.eq(200);
            const accountByID = response.body; 
            expect(accountByID).to.have.property('id');
            expect(accountByID).to.have.property('customerId');
            expect(accountByID).to.have.property('type');
            expect(accountByID).to.have.property('balance');
          });
    });

    it("Get account by account ID, incorrect account ID", () => {

        getRequest.getRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${invalidID}`).then((response) => {
            expect(response.status).to.eq(400);
        });

    });

    it("Get account by account ID, without account ID", () => {

        getRequest.getRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/`).then((response) => {
            expect(response.status).to.eq(404);
        });

    });
});