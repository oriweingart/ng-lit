import {
    get
} from "lodash-es";
import {
    watchIfNeeded
} from "./watchers";

const SECOND = 1000;

/**
 * @param {LitElement} baseElement - the LitElement to extend
 */
export const NgLit = baseElement => {
    return class extends baseElement {
        /**
         * Extend the LitElement `createProperty` method to map angular properties
         */
        static createProperty(name, options) {
            super.createProperty(name, options);
            if (options.fromNg) {
                if (!this._ngProperties) {
                    this._ngProperties = {};
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
            (async () => {
                const scope = await this._getScope(SECOND * 0.3);
                this._updateWithScope({ scope, changedProps });
            })();
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
            return true;
        }

        // TODO: refactor
        _getScope(waitTime) {
            return new Promise((resolve, reject) => {
                const { angular } = window;
                if (this.__ngScope) {
                    resolve(this.__ngScope);
                }
                let scope = angular ? angular.element(this.parentElement).scope() : null;
                if (scope) {
                    this.__ngScope = scope;
                    resolve(this.__ngScope);
                } else if (waitTime) {
                    setTimeout(async () => {
                        scope = angular ? angular.element(this.parentElement).scope() : null;
                        this.__ngScope = scope;
                        // Try to extract angular's $apply, otherwise use setTimeout
                        const $body = angular ? angular.element(
                          document.getElementsByTagName('ng-app')[0] ||
                          document.querySelector("[ng-app]")
                        ) : null;
                        const nextDigest = get($body, 'scope().$root.$apply') || setTimeout;
                        nextDigest(() => {
                            resolve(this.__ngScope);
                        });
                    }, waitTime);
                } else {
                    reject(new Error('Scope was not found'));
                }
            });
        }

        /**
         * Commit an update with the scope and the changedProp
         * @param scope
         * @param changedProps
         * @private
         */
        _updateWithScope({ scope, changedProps }) {
            for (const [ngPropName, ngPropOptions] of Object.entries(this.constructor._ngProperties)) {
                const ngPropRawValue = this.getAttribute(ngPropName);
                const ngValue = get(scope, ngPropRawValue);
                if (!ngValue || typeof ngValue === 'string') {
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
};

export default NgLit;
