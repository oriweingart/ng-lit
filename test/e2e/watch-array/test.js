import { deepStrictEqual } from 'assert';
import { init, NgNightmare, removeWhiteSpaces } from '../utils';

/**
 * Render elements with array watched items on the scope
 */
let nightmare = null;
describe('watch array property', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should add one item from angular', async () => {
    let items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
    await nightmare.type('#ng-element-input', 'new item from angular')
      .click('#ng-element-button')
      .wait(50);
    items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer","new item from angular"]  _remove item 0_  _remove item 1_  _remove item 2_ _remove item 3_');
  });

  it('should add two items from angular', async () => {
    this.timeout('40s');
    let items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
    await nightmare.type('#ng-element-input', 'new item from angular')
                      .click('#ng-element-button')
                      .wait(50)
                      .type('#ng-element-input', 'another item from angular')
                      .click('#ng-element-button')
                      .wait(50);

    items = await nightmare.getNgLitElement().end();
    deepStrictEqual(removeWhiteSpaces(items),
                    removeWhiteSpaces('items in ng-lit: ["dog","laptop","beer","new item from angular","another item from angular"]  _remove item 0_  _remove item 1_ _remove item 2_  _remove item 3_  _remove item 4_')
    );
  });

  it('should add one item from angular and remove it from ng-lit', async () => {
    this.timeout('40s');
    let items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
    await nightmare.type('#ng-element-input', 'new item from angular')
      .click('#ng-element-button')
      .wait(50);
    items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer","new item from angular"]  _remove item 0_  _remove item 1_  _remove item 2_ _remove item 3_');
    await nightmare.removeItemInNgLit(4);
    items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items,'items in ng-lit: ["dog","laptop","beer"]  _remove item 0_  _remove item 1_  _remove item 2_');
  });

});
