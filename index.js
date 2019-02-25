const get = (obj, path) => {
    let paths = path.split('.')
        , current = obj
        , i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

const SECOND = 1000;

/**
 * Mixing that run lit-element's requestUpdate() when a prop is changed on the object
 * @param obj
 * @param elm
 */
const objectWatcherMixing = (obj, elm, scope) => {
    obj.__litElms = obj.__litElms || [];
    obj.__litElms.push(elm);
    Object.keys(obj).filter(key=>!key.startsWith('__')).map(
      prop => {
          let value = obj[prop];
          delete obj[prop];
          obj[`__${prop}`] = value;
          Object.defineProperty(obj, prop, {
              get: function () {
                  return obj[`__${prop}`]
              },
              set: function (val) {
                  obj[`__${prop}`] = val;
                  obj.__litElms.map(
                    theElm => theElm.requestUpdate()
                  );
                  scope.$applyAsync();
              }
          });
      }
    )
}

/**
 * Mixing that run lit-element's requestUpdate() when an array was changed
 * @param arr
 * @param elm
 */
const ARRAY_MUTATIONS = ['fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'];
const arrayWatcherMixing = (arr, elm, scope) => {
    ARRAY_MUTATIONS.map(
      mutationName => {
          arr.__litElms = arr.__litElms || [];
          arr.__litElms.push(elm);
          arr[mutationName] = function () {
              Array.prototype[mutationName].apply(this, arguments);
              arr.__litElms.map(
                theElm => theElm.requestUpdate()
              );
              scope.$applyAsync();
          }
      }
  );
};

/**
 * @param {LitElement} baseElement - the LitElement to extend
 */
export const NgLit = baseElement => class extends baseElement {
    /**
     * Extend the LitElement `createProperty` method to map angular properties
     */
    static createProperty(name, options) {
        super.createProperty(name, options);
        if (options.fromNg) {
            if (!this._ngProperties) {
                this._ngProperties = {}
            }
            this._ngProperties[name] = options;
        }
    }
    /**
     * Runs a callback on the next digest cycle
     * @param cb
     */
     _nextDigestWithScope (cb, waitTime) {
        const scope = angular.element(this.parentElement).scope();
        if (scope) {
            // Try to extract angular's $apply, otherwise use setTimeout
            const $body = angular.element(
              document.getElementsByTagName('ng-app')[0] ||
              document.querySelector("[ng-app]")
            );
            const nextDigest = get($body, 'scope().$root.$apply') || setTimeout;
            nextDigest(()=>{
                cb({scope})
            })
        } else {
            if (waitTime) {
                setTimeout(()=>{
                    this._nextDigestWithScope(cb,0)
                }, waitTime)
            }
        }
    }
    /**
     * Check for changed properties and inject angular properties from scope if possible
     */
    update(changedProps) {
        if (!this.constructor._ngProperties) {
            super.update(changedProps);
            return;
        }
        this._nextDigestWithScope(({scope})=> {
            this._commitWIthScope({scope, changedProps})
        }, SECOND * 0.01)
    }

    /**
     * Commit an update with the scope and the changedProp
     * @param scope
     * @param changedProps
     * @private
     */
    _commitWIthScope ({scope, changedProps}) {
        for (let [ngPropName, ngPropOptions] of Object.entries(this.constructor._ngProperties)) {
            const ngPropRawValue = this.getAttribute(ngPropName);
            let ngValue = get(scope, ngPropRawValue);
            if (!ngValue || typeof ngValue == 'string') {
                this[ngPropName] = null;
                changedProps.delete(ngPropName);
            } else {
                // Watch it
                if (ngPropOptions.watch && !ngPropOptions._watcher) {
                    // Array
                    if (Array.isArray(ngValue)) {
                        ngPropOptions._watcher = true;
                        arrayWatcherMixing(ngValue, this, scope);
                    }
                    // Object
                    if (ngValue.constructor == Object) {
                        ngPropOptions._watcher = true;
                        objectWatcherMixing(ngValue, this, scope)
                    }
                }
                this[ngPropName] = ngValue;
                changedProps.set(ngPropName, ngValue);
            }
        }
        super.update(changedProps);
    }
};

export default NgLit;
