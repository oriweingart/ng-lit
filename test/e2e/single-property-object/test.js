import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

let nightmare = null;
describe('single object property', async function() {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular render the user name', async () => {
    const userName = await nightmare.getNgElement().end();
    deepStrictEqual(userName, "user name in angular: John Doe");
  });

  it('should validate ng-lit render the user name', async () => {
    const userName = await nightmare.getNgLitElement().end();
    deepStrictEqual(userName, "user name in ng-lit: John Doe");
  });

});
