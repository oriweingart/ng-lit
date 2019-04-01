import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

/**
 * Render elements mocked scope
 */
let nightmare = null;
describe('MockScope', async function() {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit render the user name from the MockScope', async () => {
    const userName = await nightmare.getNgLitElement().end();
    deepStrictEqual(userName, "user name in ng-lit: John Doe");
  });

});
