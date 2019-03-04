import Nightmare from "nightmare";
import { deepStrictEqual } from 'assert';
import { init, COMMANDS } from '../utils';

const { GET_NG_LIT_ELM } = COMMANDS;


let nightmare = null;
describe('watch object property', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should update lastName from angular', async () => {
    let items = await nightmare.evaluate(...GET_NG_LIT_ELM);
    deepStrictEqual(items,'user name in ng-lit: John Doe');
    await nightmare.type('#ng-element-input', ' with new name from angular')
      .wait(50);
    items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,'user name in ng-lit: John Doe with new name from angular');
  });

});
