import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

let nightmare = null;
describe('ng-transclude directive', async function() {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the TRNACLUDED directive', async () => {
    const transcluded = await nightmare.getNgElement().end();
    deepStrictEqual(transcluded, "TRNACLUDED:\n");
  });

  it('should validate ng-lit draw the user name within the TRNACLUDED directive', async () => {
    const userName = await nightmare.getNgLitElement().end();
    deepStrictEqual(userName, "user name in ng-lit: John Doe");
  });

});
