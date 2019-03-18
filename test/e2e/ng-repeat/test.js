import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

let nightmare = null;
describe('ng-repeat directive', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit render all items within ng-repeat loop', async () => {
    let userName = await nightmare.getNgLitElementWithId(0);
    deepStrictEqual(userName, "user name in ng-lit: Freddy krueger");

    userName = await nightmare.getNgLitElementWithId(1);
    deepStrictEqual(userName, "user name in ng-lit: Jason Voorhees");

    userName = await nightmare.getNgLitElementWithId(2).end();
    deepStrictEqual(userName, "user name in ng-lit: Michael Myers");
  });

});
