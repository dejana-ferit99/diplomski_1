const loginEndpoint =  require('../pageObjects/login');
const customerEndpoint =require('../pageObjects/customerDetails');
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
            apiUrl1 = `http://parabank.parasoft.com/parabank/services_proxy/bank/customers/${userID}`;
          });
          
    });
    it("Get customer details with valid user id", { tags: ['@flow1'] }, () => {

        customerEndpoint.accountByID(apiUrl1, authToken).then((response) => {
            expect(response.status).to.eq(200);
            const customerDetails = response.body; 
            expect(customerDetails).to.have.property('id');
            expect(customerDetails).to.have.property('firstName');
            expect(customerDetails).to.have.property('lastName');
            expect(customerDetails).to.have.property('address');
            expect(customerDetails.address).to.have.property('street');
            expect(customerDetails.address).to.have.property('city');
            expect(customerDetails.address).to.have.property('state');
            expect(customerDetails.address).to.have.property('zipCode');
            expect(customerDetails).to.have.property('phoneNumber');
            expect(customerDetails).to.have.property('ssn');
        });
    }); 
    it("Get customer details without user id", () => {

        customerEndpoint.accountByID('http://parabank.parasoft.com/parabank/services_proxy/bank/customers/', authToken).then((response) => {
            expect(response.status).to.eq(404);
        });

    });
    it("Get customer details with invalid user id", () => {

        customerEndpoint.accountByID('http://parabank.parasoft.com/parabank/services_proxy/bank/customers/13', authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    });
});