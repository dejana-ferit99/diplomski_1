const postRequest =  require('../pageObjects/POSTrequest');
const config = require('../config/config');


describe('Parabank Login API Test', () => {

  const { username, password } = config;

  it('Should successfully login with correct credentials', { tags: ['@login'] }, () => {
    postRequest.login(username, password).then((response) => {
      expect(response.status).to.eq(200);
      const responseBody = postRequest.parseXmlToJson(response.body);
      expect(responseBody).to.have.property('customer');
      const customer = responseBody.customer;
      expect(customer).to.have.property('id');
      expect(customer).to.have.property('firstName');
      expect(customer).to.have.property('lastName');
      expect(customer).to.have.property('address');
      expect(customer.address).to.have.property('street');
      expect(customer.address).to.have.property('city');
      expect(customer.address).to.have.property('state');
      expect(customer.address).to.have.property('zipCode');
      expect(customer).to.have.property('phoneNumber');
      expect(customer).to.have.property('ssn');
    });
  });

  it('Should fail login with incorrect password', () => {
    postRequest.login(username, '123456').then((response) => {
      expect(response.status).to.eq(400);
      const responseBody = response.body;
      expect(responseBody).to.equal('Invalid username and/or password');
    });
  });

  it('Should fail login with incorrect username', () => {
    postRequest.login('user1', password).then((response) => {
      expect(response.status).to.eq(400);
      const responseBody = response.body;
      expect(responseBody).to.equal('Invalid username and/or password');
    });
  });

  it('Should fail login with incorrect credentials (incorrect password and username)', () => {
    postRequest.login('user1', '123456').then((response) => {
      expect(response.status).to.eq(400);
      const responseBody = response.body;
      expect(responseBody).to.equal('Invalid username and/or password');
    });
  });
  
});
