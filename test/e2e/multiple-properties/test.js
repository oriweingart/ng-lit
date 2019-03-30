import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

/**
 * Render elements with multiple properties: array and object
 */
let nightmare = null;
describe('multiple properties: array and object', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular render the items and user name', async () => {
    const items = await nightmare.getNgElement().end();
    deepStrictEqual(items, 'user name and items in angular: John Doe ["dog","laptop","beer"]');
  });

  it('should validate ng-lit render the items and user name', async () => {
    const items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items, 'user name and items in ng-lit: John Doe ["dog","laptop","beer"]');
  });

});
