const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  init,
  COMMANDS :{ GET_NG_LIT_ELM }
} = require('../utils');

let nightmare = null;
describe('no angular', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit draw without angular', async () => {
    const items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,  'items in ng-lit: null and name: John');
  });

});
