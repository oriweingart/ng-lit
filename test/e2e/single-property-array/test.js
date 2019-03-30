import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

/**
 * Render elements with single array property
 */
let nightmare = null;
describe('single array property', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular render the items', async () => {
    const items = await nightmare.getNgElement().end();
    deepStrictEqual(items, 'items in angular: ["dog","laptop","beer"]');
  });

  it('should validate ng-lit render the items', async () => {
    const items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items,  'items in ng-lit: ["dog","laptop","beer"]');
  });

});
