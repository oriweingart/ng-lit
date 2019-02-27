const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  init,
  COMMANDS :{ GET_NG_ELM, GET_NG_LIT_ELM }
} = require('../utils');

let nightmare = null;
describe('single array property', async function () {

  this.timeout('30s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the items', async () => {
    const items = await nightmare.evaluate(...GET_NG_ELM).end();
    deepStrictEqual(items, 'items in angular: ["dog","laptop","beer"]');
  });

  it('should validate ng-lit draw the items', async () => {
    const items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,  'items in ng-lit: ["dog","laptop","beer"]');
  });

});
