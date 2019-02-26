import {watchIfNeeded} from "./watchers";

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
     * Check for changed properties and inject angular properties from scope if possible
     */
    update(changedProps) {
        if (!this._shouldUpdateNgProp()) {
            super.update(changedProps);
            return;
        }
        this._getScope(({scope})=> {
            this._commitWIthScope({scope, changedProps});
        }, SECOND * 0.01)
    }

    /**
     * Return true if we should update angular properties
     * @returns {boolean}
     * @private
     */
    _shouldUpdateNgProp() {
        if (!this.constructor._ngProperties) {
            return false;
        }
        // TODO: check if the changed prop is from angular
        return true
    }
    /**
     * Runs a callback on the next digest cycle
     * @param cb
     */
     _getScope (cb, waitTime) {
        const scope = this.__ngScope || angular.element(this.parentElement).scope();
        if (scope) {
            this.__ngScope = scope;
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
                    this._getScope(cb,0)
                }, waitTime)
            }
        }
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
                watchIfNeeded(ngPropOptions, this, scope, ngValue);
                this[ngPropName] = ngValue;
                changedProps.set(ngPropName, ngValue);
            }
        }
        super.update(changedProps);
    }
};

export default NgLit;
