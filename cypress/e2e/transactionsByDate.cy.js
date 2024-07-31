const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const apiNonStatic = require('../pageObjects/ApiNonStatic');
const config = require('../config/config');

describe('Parabank Transactions By Date API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;
    let apiUrl2;
    let accountID;
    const todayDate = apiNonStatic.formatDate();
    const todayDateString = String(todayDate);
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
            apiUrl2 = `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/onDate/${todayDateString}`;
            console.log(apiUrl2);
        });
    });  

    it("Get transactions for specific date for account", () => {

        getRequest.getRequest(apiUrl2).then((response) => {
            expect(response.status).to.eq(200);
            const transfer = response.body[0]; 
            expect(transfer).to.have.property('id');
            expect(transfer).to.have.property('accountId');
            expect(transfer).to.have.property('date');
            expect(transfer).to.have.property('amount');
            expect(transfer).to.have.property('description');
        });

    });

    it("Get transactions for specific date (transactions for this date does not exist) for account", () => {

        getRequest.getRequest(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/onDate/3-23-2024`).then((response) => {
            expect(response.status).to.eq(200);
        });

    });

    it("Get transactions without specific date for account", () => {

        getRequest.getRequestNoAutorization(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountID}/transactions/onDate/`).then((response) => {
            expect(response.status).to.eq(404);
        });

    });

    it("Get transactions for invalid account ID", () => {

        getRequest.getRequestNoAutorization(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${invalidID}/transactions/onDate/${todayDateString}`).then((response) => {
            expect(response.status).to.eq(400);
        });

    });
});

