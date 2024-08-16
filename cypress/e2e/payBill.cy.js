const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const apiNonStatic = require('../pageObjects/ApiNonStatic');
const config = require('../config/config');

describe('Parabank Pay Bill API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;
    let accountID;
    const invalidID = apiNonStatic.generateRandomString(10); 

    before('Should successfully login with correct credentials', () => {

        postRequest.login(username, password).then((response) => {
            expect(response.status).to.eq(200);
            const responseBody = postRequest.parseXmlToJson(response.body);
            expect(responseBody).to.have.property('customer');
            const customer = responseBody.customer;
            userID = customer.id._text.replace(/"/g, '');
            apiUrl1 = `https://parabank.parasoft.com/parabank/services_proxy/bank/customers/${userID}/accounts`;
          });
          
    });
    
    it("Get all bank accounts of the user by valid user ID", () => {
        getRequest.getRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            apiUrl1 =  `https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=200`;
        });
    });

    it("Pay bill with valid accountId and amount using valid body data", () => {
        //405 check
        cy.fixture('billDataBody').then((data) => {
            postRequest.postRequestWithBodyData(apiUrl1, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(200);
                const account = response.body; 
                expect(account).to.have.property('payeeName');
                expect(account).to.have.property('amount');
                expect(account).to.have.property('accountId');
            });
        });

    });

    it("Pay bill with valid accountId and amount without body data", () => {
//check i data argument can be deleted
        cy.fixture('billDataBody').then(() => {
            postRequest.postRequestWithBodyData(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=200`).then((response) => {
                expect(response.status).to.eq(400);
            });
        });

    });

    it("Pay bill with valid accountId and without amount using valid body data", () => {

        cy.fixture('billDataBody').then((data) => {
            postRequest.postRequestWithBodyData(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=`, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(400);
            });
        });

    });

    it("Pay bill with invalid accountId and without amount using valid body data", () => {

        cy.fixture('billDataBody').then((data) => {
            postRequest.postRequestWithBodyData(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${invalidID}&amount=`, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(400);
            });
        });

    });

    it("Pay bill with uncompleted body data (no accountNumber)", () => {

        cy.fixture('billDataBody').then((data) => {
            postRequest.postRequestWithBodyData(`https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${accountID}&amount=200`, data.billDataBody[0]).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

    });

});