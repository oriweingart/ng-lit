import assert from 'assert';
import { describe } from "mocha";
import {
  arrayWatcherMixing
} from "../../watchers";

describe('arrayWatcherMixing', () => {

  let arr;
  let litElmStub1;
  let litElmStub2;
  let ngScopeStub;

  beforeEach(()=> {
    arr = [];
    litElmStub1 = {
      called: 0,
      requestUpdate: () => {
        litElmStub1.called++;
      }
    };
    litElmStub2 = {
      called: 0,
      requestUpdate: () => {
        litElmStub2.called++;
      }
    };
    ngScopeStub = {
      called: 0,
      $applyAsync: () => {
        ngScopeStub.called++;
      }
    };
  });

  it('should run requestUpdate and $applyAsync when calling push', () => {
    assert(ngScopeStub.called === 0);
    assert(litElmStub1.called === 0);
    arrayWatcherMixing(arr, litElmStub1, ngScopeStub);
    arr.push('item 1');
    assert(ngScopeStub.called === 1);
    assert(litElmStub1.called === 1);
    arr.push('item 2');
    assert(ngScopeStub.called === 2);
    assert(litElmStub1.called === 2);
    arr.push({ item: 'item 3' });
    assert(ngScopeStub.called === 3);
    assert(litElmStub1.called === 3);
    arr.push(4);
    assert(ngScopeStub.called === 4);
    assert(litElmStub1.called === 4);
  });

  it('should run requestUpdate and $applyAsync when calling pop', () => {
    assert(ngScopeStub.called === 0);
    assert(litElmStub1.called === 0);
    arrayWatcherMixing(arr, litElmStub1, ngScopeStub);
    arr.push('item 1');
    assert(ngScopeStub.called === 1);
    assert(litElmStub1.called === 1);
    arr.pop();
    assert(ngScopeStub.called === 2);
    assert(litElmStub1.called === 2);
    arr.push({ item: 'item 3' });
    assert(ngScopeStub.called === 3);
    assert(litElmStub1.called === 3);
    arr.pop();
    assert(ngScopeStub.called === 4);
    assert(litElmStub1.called === 4);
  });

  it('should run requestUpdate and $applyAsync when calling fill', () => {
    assert(ngScopeStub.called === 0);
    assert(litElmStub1.called === 0);
    arrayWatcherMixing(arr, litElmStub1, ngScopeStub);
    arr.push('item 1');
    assert(ngScopeStub.called === 1);
    assert(litElmStub1.called === 1);
    arr.fill(1);
    assert(ngScopeStub.called === 2);
    assert(litElmStub1.called === 2);
    arr.push({ item: 'item 3' });
    assert(ngScopeStub.called === 3);
    assert(litElmStub1.called === 3);
    arr.fill(1, 2);
    assert(ngScopeStub.called === 4);
    assert(litElmStub1.called === 4);
  });

  it('should run requestUpdate and $applyAsync when calling reverse', () => {
    assert(ngScopeStub.called === 0);
    assert(litElmStub1.called === 0);
    arrayWatcherMixing(arr, litElmStub1, ngScopeStub);
    arr.push(1);
    arr.push(2);
    assert(ngScopeStub.called === 2);
    assert(litElmStub1.called === 2);
    arr.reverse();
    assert(ngScopeStub.called === 3);
    assert(litElmStub1.called === 3);
  });

});
