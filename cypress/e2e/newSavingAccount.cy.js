const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const apiNonStatic = require('../pageObjects/ApiNonStatic');
const config = require('../config/config');

describe('Parabank New Saving Account API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;
    let apiUrls;
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

    it("Get all bank accounts of the user by valid user ID", () => {
        getRequest.getRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            console.log(accountID);
            apiUrls = `https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=1&fromAccountId=${accountID}`;
          });
    }); 

    it("Creating new saving account using valid data", () => {

        postRequest.postRequest(apiUrls).then((response) => {
            expect(response.status).to.eq(200);
            const newAccount = response.body; 
            expect(newAccount).to.have.property('id');
            expect(newAccount).to.have.property('customerId');
            expect(newAccount).to.have.property('type');
            expect(newAccount).to.have.property('balance');
        });

    }); 

    it("Creating new saving account using valid customerID, valid AccountType and invalid fromAccountId", () => {

        postRequest.postRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=1&fromAccountId=${invalidID}`).then((response) => {
            expect(response.status).to.eq(400);
        });

    });

    it("Creating new saving account using valid customerID, invalid AccountType and invalid fromAccountId", () => {

        postRequest.postRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=-1&fromAccountId=${invalidID}`).then((response) => {
            expect(response.status).to.eq(400);
        });

    }); 

}); 