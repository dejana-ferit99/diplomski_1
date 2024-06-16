const loginEndpoint =  require('../pageObjects/login');
const customerInfoEndpoint =  require('../pageObjects/updateCustomerInfo');
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
        apiUrl1 = `https://parabank.parasoft.com/parabank/services_proxy/bank/customers/update/${userID}?firstName=User&lastName=Useric&street=Usely&city=Osijek&state=Osjecko-baranjska&zipCode=31000&phoneNumber=0987654321&ssn=1234567890&username=&password=`;
    });
      
    });

    it("Update customer details with valid user id", () => {

        customerInfoEndpoint.updateCustomerInfo(apiUrl1, authToken).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.equal('Successfully updated customer profile');
        });

    }); 

    it("Update customer details without state value", () => {

        customerInfoEndpoint.updateCustomerInfo(`https://parabank.parasoft.com/parabank/services_proxy/bank/customers/update/${userID}?firstName=User&lastName=Useric&street=Usely&city=Osijek&state=&zipCode=31000&phoneNumber=0987654321&ssn=1234567890&username=&password=`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    }); 
   
    it("Update customer details with invalid user id", () => {

        customerInfoEndpoint.updateCustomerInfo(`https://parabank.parasoft.com/parabank/services_proxy/bank/customers/update/13?firstName=User&lastName=Useric&street=Usely&city=Osijek&state=Osjecko-baranjska&zipCode=31000&phoneNumber=0987654321&ssn=1234567890&username=&password=`, authToken).then((response) => {
            expect(response.status).to.eq(500);
        });

    });
});
