const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  init,
  COMMANDS :{ GET_NG_ELM, GET_NG_LIT_ELM }
} = require('../utils');

let nightmare = null;
describe('multiple properties: array and object', async function () {

  this.timeout('30s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the items and user name', async () => {
    const items = await nightmare.evaluate(...GET_NG_ELM).end();
    deepStrictEqual(items, 'user name and items in angular: John Doe ["dog","laptop","beer"]');
  });

  it('should validate ng-lit draw the items and user name', async () => {
    const items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items, 'user name and items in ng-lit: John Doe ["dog","laptop","beer"]');
  });

});
