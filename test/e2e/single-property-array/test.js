import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

let nightmare = null;
describe('single array property', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the items', async () => {
    const items = await nightmare.getNgElement().end();
    deepStrictEqual(items, 'items in angular: ["dog","laptop","beer"]');
  });

  it('should validate ng-lit draw the items', async () => {
    const items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items,  'items in ng-lit: ["dog","laptop","beer"]');
  });

});
