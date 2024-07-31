const getRequest =  require('../pageObjects/GETrequest');
const postRequest =  require('../pageObjects/POSTrequest');
const config = require('../config/config');

describe('Parabank Loan Request API Test', () => {
    const { username, password } = config;
    let userID;
    let apiUrl1;
    let apiUrls;
    let apiUrli;
    let accountID;

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
    it("Get all bank accounts of the user by valid user ID", () => {

        getRequest.getRequest(apiUrl1).then((response) => {
            expect(response.status).to.eq(200);
            const account = response.body[0]; 
            expect(account).to.have.property('id');
            accountID = account.id;
            apiUrls = `https://parabank.parasoft.com/parabank/services_proxy/bank/requestLoan?customerId=${userID}&amount=100&downPayment=10&fromAccountId=${accountID}`;
            apiUrli = `https://parabank.parasoft.com/parabank/services_proxy/bank/requestLoan?customerId=${userID}&amount=10000&downPayment=100&fromAccountId=${accountID}`;
        });
    }); 
    it("Send a loan request with sufficient funds", () => {

        postRequest.postRequest(apiUrls).then((response) => {
            expect(response.status).to.eq(200);
            const loanRequest = response.body; 
            expect(loanRequest).to.have.property('responseDate');
            expect(loanRequest).to.have.property('loanProviderName');
            expect(loanRequest).to.have.property('approved');
            expect(loanRequest).to.have.property('accountId');
        });

    }); 
    it("Send a loan request with insufficient downpayment", () => {

        postRequest.postRequest(apiUrli).then((response) => {
            expect(response.status).to.eq(200);
            const loanRequest = response.body; 
            expect(loanRequest).to.have.property('responseDate');
            expect(loanRequest).to.have.property('loanProviderName');
            expect(loanRequest).to.have.property('approved');
            expect(loanRequest).to.have.property('accountId');
        });

    }); 
});