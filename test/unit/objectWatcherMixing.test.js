import assert from 'assert';
import { describe } from "mocha";
import {
  objectWatcherMixing
} from "../../watchers";

const {
  deepStrictEqual
} = assert;

describe('objectWatcherMixing', () => {

  let obj;
  let litElmStub1;
  let litElmStub2;
  let ngScopeStub;

  beforeEach(()=> {
    obj = {
      someKey1: 'someValue1',
      someKey2: 'someValue2'
    };
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

  it('should add __ngWatch keys on object', () => {
    objectWatcherMixing(obj, litElmStub1, ngScopeStub);
    deepStrictEqual(obj.__ngWatchsomeKey1, 'someValue1');
    deepStrictEqual(obj.__ngWatchsomeKey2, 'someValue2');
  });

  it('should run requestUpdate and $applyAsync when the keys are changed', () => {
    assert(ngScopeStub.called === 0);
    assert(litElmStub1.called === 0);
    objectWatcherMixing(obj, litElmStub1, ngScopeStub);
    obj.someKey1 = "change someKey1";
    assert(ngScopeStub.called === 1);
    assert(litElmStub1.called === 1);
    obj.someKey2 = "change someKey2";
    assert(ngScopeStub.called === 2);
    assert(litElmStub1.called === 2);
    obj.someKey1 = "another key1";
    assert(ngScopeStub.called === 3);
    assert(litElmStub1.called === 3);
    obj.someKey2 = "another key2";
    assert(ngScopeStub.called === 4);
    assert(litElmStub1.called === 4);
  });

  it('should run requestUpdate on two litElement watched by object', () => {
    assert(ngScopeStub.called === 0);
    assert(litElmStub1.called === 0);
    assert(litElmStub2.called === 0);
    objectWatcherMixing(obj, litElmStub1, ngScopeStub);
    objectWatcherMixing(obj, litElmStub2, ngScopeStub);
    obj.someKey1 = "change someKey1";
    assert(ngScopeStub.called === 1);
    assert(litElmStub1.called === 1);
    assert(litElmStub2.called === 1);
    obj.someKey2 = "change someKey2";
    assert(ngScopeStub.called === 2);
    assert(litElmStub1.called === 2);
    assert(litElmStub2.called === 2);
    obj.someKey1 = "another key1";
    assert(ngScopeStub.called === 3);
    assert(litElmStub1.called === 3);
    assert(litElmStub2.called === 3);
    obj.someKey2 = "another key2";
    assert(ngScopeStub.called === 4);
    assert(litElmStub1.called === 4);
    assert(litElmStub2.called === 4);
  });

});
