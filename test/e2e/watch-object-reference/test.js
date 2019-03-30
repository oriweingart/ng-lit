import { deepStrictEqual } from 'assert';
import { init , NgNightmare } from '../utils';

/**
 * Render elements with object reference watched on the scope
 */
let nightmare = null;
describe('watch object reference', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new NgNightmare();
    await init(nightmare, __dirname);
  });

  it('should render both angular and ng-lit', async () => {
    let items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'user name in ng-lit: John Doe');
    items = await nightmare.getNgElement().end();
    deepStrictEqual(items,'user name in angular: John Doe');
  });


  it('should render both angular and ng-lit after change the reference', async () => {
    await nightmare.click('#ng-element-button')
      .wait(50);
    let items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'user name in ng-lit: John 1 Doe 1');
    items = await nightmare.getNgElement();
    deepStrictEqual(items,'user name in angular: John 1 Doe 1');
    await nightmare.click('#ng-element-button')
      .wait(50);
    items = await nightmare.getNgLitElement();
    deepStrictEqual(items,'user name in ng-lit: John 2 Doe 2');
    items = await nightmare.getNgElement().end();
    deepStrictEqual(items,'user name in angular: John 2 Doe 2');
  });

});
