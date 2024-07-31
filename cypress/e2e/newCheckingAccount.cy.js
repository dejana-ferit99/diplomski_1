const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const apiNonStatic = require('../pageObjects/ApiNonStatic');
const config = require('../config/config');

describe('Parabank New Checking Account API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;
    let apiUrlc;
    let accountID;
    const invalidID = apiNonStatic.generateRandomString(10); 

    before('Login with correct credentials', () => {

        postRequest.login(username, password).then((response) => {
            expect(response.status).to.eq(200);
            const responseBody = postRequest.parseXmlToJson(response.body);
            expect(responseBody).to.have.property('customer');
            const customer = responseBody.customer;
            userID = customer.id._text.replace(/"/g, '');
            apiUrl1 = `https://parabank.parasoft.com/parabank/services_proxy/bank/customers/${userID}/accounts`;
        });

    });

    it("Get all checking bank accounts of the user by valid user ID", () => {

        getRequest.getRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            apiUrlc = `https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=0&fromAccountId=${accountID}`;
        });
    }); 

    it("Creating new checking account using valid data", () => {

        postRequest.postRequest(apiUrlc).then((response) => {
            expect(response.status).to.eq(200);
            const newAccount = response.body; 
            expect(newAccount).to.have.property('id');
            expect(newAccount).to.have.property('customerId');
            expect(newAccount).to.have.property('type');
            expect(newAccount).to.have.property('balance');
        });

    }); 

    it("Creating new checking account using valid customerId, invalid AccountType and valid fromAccountID", () => {

        postRequest.postRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=-1&fromAccountId=${accountID}`).then((response) => {
            expect(response.status).to.eq(500);
        });
        //check this

    }); 
    it("Creating new checking account using valid customerId, invalid AccountType and invalid fromAccountID", () => {

        postRequest.postRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${userID}&newAccountType=-1&fromAccountId=${invalidID}`).then((response) => {
            expect(response.status).to.eq(400);
        });

    });
    it("Creating new checking account using invalid customerId, invalid AccountType and valid fromAccountID", () => {

        postRequest.postRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${invalidID}&newAccountType=-1&fromAccountId=${accountID}`).then((response) => {
            expect(response.status).to.eq(400);
        });

    }); 
    it("Creating new checking account using invalid customerId, valid AccountType and invalid fromAccountID", () => {

        postRequest.postRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/createAccount?customerId=${invalidID}&newAccountType=0&fromAccountId=${invalidID}`).then((response) => {
            expect(response.status).to.eq(400);
        });

    }); 
}); 