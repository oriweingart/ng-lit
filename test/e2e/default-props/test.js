import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

let nightmare = null;
describe('multiple properties with default values', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit render the items and user name with default values', async () => {
    const items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items, 'user name and items in ng-lit: Default First Name Default Last Name ["dog","laptop","beer"]');
  });

});
