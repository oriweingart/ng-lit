const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  init,
  COMMANDS :{ GET_NG_ELM, GET_NG_LIT_ELM }
} = require('../utils');

let nightmare = null;
describe('single object property', async function() {

  this.timeout('30s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the user name', async () => {
    const userName = await nightmare.evaluate(...GET_NG_ELM).end();
    deepStrictEqual(userName, "user name in angular: John Doe");
  });

  it('should validate ng-lit draw the user name', async () => {
    const userName = await nightmare.evaluate(...GET_NG_LIT_ELM).end();;
    deepStrictEqual(userName, "user name in ng-lit: John Doe");
  });

});
