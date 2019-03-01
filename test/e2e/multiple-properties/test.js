const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  init,
  COMMANDS :{ GET_NG_ELM, GET_NG_LIT_ELM }
} = require('../utils');

let nightmare = null;
console.log('before describe')
describe('multiple properties: array and object', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    try {
      console.log('before beforeEach')
      nightmare = new Nightmare();
      console.log('new Nightmare')
      await init(nightmare, __dirname);
      console.log('after init')
    } catch (e) {
      console.log('error in beforeEach');
      console.log(e);
    }
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
