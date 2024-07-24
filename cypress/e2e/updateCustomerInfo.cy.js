const postRequest =  require('../pageObjects/POSTrequest');
const config = require('../config/config');

describe('Parabank Update Customer Info API Test', () => {
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
        apiUrl1 = `https://parabank.parasoft.com/parabank/services_proxy/bank/customers/update/${userID}?firstName=User&lastName=Useric&street=Usely&city=Osijek&state=Osjecko-baranjska&zipCode=31000&phoneNumber=0987654321&ssn=1234567890&username=${username}&password=${password}`;
    });
      
    });

    it("Update customer details with valid user id", () => {

        postRequest.postRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
        });

    }); 
   
    it("Update customer details with invalid user id", () => {

        postRequest.postRequestNoAutorization(`https://parabank.parasoft.com/parabank/services_proxy/bank/customers/update/13?firstName=User&lastName=Useric&street=Usely&city=Osijek&state=Osjecko-baranjska&zipCode=31000&phoneNumber=0987654321&ssn=1234567890&username=${username}&password=${password}`).then((response) => {
            expect(response.status).to.eq(401);
        });

    });
});
