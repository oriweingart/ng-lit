const assert = require('assert');
const Nightmare = require('nightmare');
const {
  init
} = require('../utils');

let nightmare = null;
describe('watch array property', async function () {

  this.timeout('30s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the watched items', async () => {
    const items = await nightmare.evaluate(() => document.querySelector('#ng-element').innerText).end();
    assert(items === 'items in angular: ["dog","laptop","beer"]');
  });

  it('should validate ng-lit draw the watched items', async () => {
    const items = await nightmare.evaluate(() => document.querySelector('#ng-lit-element').shadowRoot.children[0].innerText).end();
    assert(items ===  'items in ng-lit: dogremove from lit laptopremove from lit beerremove from lit');
  });

  it('should add one item from angular', async () => {
    this.timeout('40s');
    await nightmare.type('#ng-element-input', 'new item from angular')
      .click('#ng-element-button')
      .wait(50)
    const items = await nightmare.evaluate(() => document.querySelector('#ng-lit-element').shadowRoot.children[0].innerText).end();
    assert(items ===  'items in ng-lit: dogremove from lit laptopremove from lit beerremove from lit new item from angularremove from lit');
  })

  it('should two items from angular', async () => {
    this.timeout('40s');
    await nightmare.type('#ng-element-input', 'new item from angular')
                      .click('#ng-element-button')
                      .wait(50)
                      .type('#ng-element-input', 'another item from angular')
                      .click('#ng-element-button')
                      .wait(50);

    const items = await nightmare.evaluate(() => document.querySelector('#ng-lit-element').shadowRoot.children[0].innerText).end();
    assert(items ===  'items in ng-lit: dogremove from lit laptopremove from lit beerremove from lit new item from angularremove from lit another item from angularremove from lit');
  });

});
