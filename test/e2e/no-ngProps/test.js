import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

/**
 * Render elements without ngProps
 */
let nightmare = null;
describe('no ngProps on element', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit render user age without any ngProps', async () => {
    const items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items, 'user age is 15');
  });

});
