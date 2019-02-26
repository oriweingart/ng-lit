const assert = require('assert');
const Nightmare = require('nightmare');
const {
  init
} = require('../utils');

let nightmare = null;
describe('single object property', async function() {

  this.timeout('30s');
  this.
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the user name', async () => {
    const userName = await nightmare.evaluate(() => document.querySelector('#ng-element').innerText).end();
    assert(userName === "user name in angular: John Doe");
  });

  it('should validate ng-lit draw the user name', async () => {
    const userName = await nightmare.evaluate(() => document.querySelector('#ng-lit-element').shadowRoot.children[0].innerText).end();
    assert(userName === "user name in ng-lit: John Doe");
  });

});
