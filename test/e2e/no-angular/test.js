import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

let nightmare = null;
describe('no angular', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit render without angular', async () => {
    const items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items,  'items in ng-lit: [] and name: John');
  });

});
