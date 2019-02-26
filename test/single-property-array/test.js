const assert = require('assert');
const Nightmare = require('nightmare');
const {
  init
} = require('../utils');

let nightmare = null;
describe('single array property', async function () {

  this.timeout('30s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the items', async () => {
    const items = await nightmare.evaluate(() => document.querySelector('#ng-element').innerText).end();
    assert(items === 'items in angular: ["dog","laptop","beer"]');
  });

  it('should validate ng-lit draw the items', async () => {
    const items = await nightmare.evaluate(() => document.querySelector('#ng-lit-element').shadowRoot.children[0].innerText).end();
    assert(items ===  "items in ng-lit: dog laptop beer");
  });

});
