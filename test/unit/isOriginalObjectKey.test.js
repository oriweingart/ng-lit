import {
  isOriginalObjectKey,
  isNotOriginalObjectKey
} from "../../watchers";
import assert from 'assert';
const {
  fail,
  deepStrictEqual
} = assert;

describe('isOriginalObjectKey', () => {

  it('should return true for key that start with __ngWatch', () => {
    assert(isOriginalObjectKey('__ngWatch123'));
    assert(isOriginalObjectKey('__ngWatchSomeProp'));
    assert(isOriginalObjectKey('__ngWatchSomeProp.2.2_'));
    assert(isOriginalObjectKey('__ngWatchSomeProp.2.2_XX_x_'));
  });

  it('should return all original keys', () => {
    const objectWithOriginalKeys = {
      key1: 'some value1',
      key2: 'some value2',
      __ngWatchOriginalKey1: 'some original ngWatch value1',
      __ngWatchOriginalKey2: 'some original ngWatch value2'
    };
    const originalKeys = Object.keys(objectWithOriginalKeys).filter(isOriginalObjectKey)
    deepStrictEqual(originalKeys, ['__ngWatchOriginalKey1', '__ngWatchOriginalKey2']);
  });

});

describe('isNotOriginalObjectKey', () => {

  it('should return true for key that doesnt start with __ngWatch', () => {
    assert(isNotOriginalObjectKey('someKey'));
    assert(isNotOriginalObjectKey(11));
    assert(isNotOriginalObjectKey('ngWatch123'));
    assert(isNotOriginalObjectKey('WatchSomeProp'));
    assert(isNotOriginalObjectKey('__ngWat'));
    assert(isNotOriginalObjectKey('_ngWatchSomeProp.2.2_XX_x_'));
  });

  it('should return all none original keys', () => {
    const objectWithOriginalKeys = {
      key1: 'some value1',
      key2: 'some value2',
      __ngWatchOriginalKey1: 'some original ngWatch value1',
      __ngWatchOriginalKey2: 'some original ngWatch value2'
    };
    const originalKeys = Object.keys(objectWithOriginalKeys).filter(isNotOriginalObjectKey)
    deepStrictEqual(originalKeys, ['key1', 'key2']);
  });

})
