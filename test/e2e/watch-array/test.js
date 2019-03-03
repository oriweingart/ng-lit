const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  init,
  COMMANDS :{  GET_NG_LIT_ELM, CLICK_REMOVE_ITEM_IN_NG_LIT }
} = require('../utils');

let nightmare = null;
describe('watch array property', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should add one item from angular', async () => {
    let items = await nightmare.evaluate(...GET_NG_LIT_ELM);
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
    await nightmare.type('#ng-element-input', 'new item from angular')
      .click('#ng-element-button')
      .wait(50);
    items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer","new item from angular"]  _remove item 0_  _remove item 1_  _remove item 2_ _remove item 3_');
  })

  it('should add two items from angular', async () => {
    this.timeout('40s');
    let items = await nightmare.evaluate(...GET_NG_LIT_ELM);
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
    await nightmare.type('#ng-element-input', 'new item from angular')
                      .click('#ng-element-button')
                      .wait(50)
                      .type('#ng-element-input', 'another item from angular')
                      .click('#ng-element-button')
                      .wait(50);

    items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer","new item from angular","another item from angular"]  _remove item 0_  _remove item 1_ _remove item 2_  _remove item 3_  _remove item 4_');
  });

  it('should add one item from angular and remove it from ng-lit', async () => {
    this.timeout('40s');
    let items = await nightmare.evaluate(...GET_NG_LIT_ELM);
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
    await nightmare.type('#ng-element-input', 'new item from angular')
      .click('#ng-element-button')
      .wait(50);
    items = await nightmare.evaluate(...GET_NG_LIT_ELM);
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer","new item from angular"]  _remove item 0_  _remove item 1_  _remove item 2_ _remove item 3_');
    await nightmare.evaluate(...CLICK_REMOVE_ITEM_IN_NG_LIT, 4);
    items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
  });

});
