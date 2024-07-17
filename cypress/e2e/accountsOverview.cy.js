const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const config = require('../config/config');

describe('Parabank Accounts Overview API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;

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
    
    it("Get all bank accounts of the user by valid user ID",  { tags: ['@flow1'] }, () => {

        getRequest.getRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            expect(account).to.have.property('customerId');
            expect(account).to.have.property('type');
            expect(account).to.have.property('balance');
        });

    });

    it("Get all bank accounts of the user by valid user ID and without authorization", () => {

        getRequest.getRequestNoAutorization(apiUrl1).then((response) => {
            expect(response.status).to.eq(401);

        });

    });

    it("Get all bank accounts of the user by invalid user Id", () => {

        getRequest.getRequestNoAutorization('https://parabank.parasoft.com/parabank/services_proxy/bank/customers/123/accounts').then((response) => {
            expect(response.status).to.eq(401);

        });

    });

    it("Get all bank accounts without user Id", () => {

        getRequest.getRequest('https://parabank.parasoft.com/parabank/services_proxy/bank/customers/accounts').then((response) => {
            expect(response.status).to.eq(400);

        });

    });

});