const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  COMMANDS :{ GET_NG_ELM, GET_NG_LIT_ELM }
} = require('../utils');

describe('multiple properties: array and object', function () {

  this.timeout('60s');

  it('should validate angular draw the items and user name', (done) => {
    let nightmare = new Nightmare()

    nightmare
      .goto('http://127.0.0.1:8081/test/e2e/multiple-properties/fixture.html')
      .wait(9000)
      .evaluate(...GET_NG_ELM)
      .end()
      .then((items) => {
        console.log(items)
        deepStrictEqual(items, 'user name and items in angular: John Doe ["dog","laptop","beer"]');
        done()
      })
      .catch(error => {
        console.error('Search failed:', error)
      })
  });


});
