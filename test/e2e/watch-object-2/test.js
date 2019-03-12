import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

let nightmare = null;
describe('watch object property', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should update lastName from angular', async () => {
    let items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'user name in ng-lit: John Doe');
    await nightmare.type('#ng-element-input', ' with new name from angular')
      .wait(50);
    items = await nightmare.getNgLitElement().end();
    deepStrictEqual(items,'user name in ng-lit: John Doe with new name from angular');
  });

});
