/* eslint-disable no-prototype-builtins,no-restricted-syntax */
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
            if (this.__shouldUpdateNgProps(changedProps)) {
                (async () => {
                    const ngScope = await this.__getNgScope();
                    this.__updateWithNgScope(ngScope, changedProps);
                })();

            } else {
                super.update(changedProps);
            }
        }


        /**
         * Internal Methods
         */


        /**
         * Check if a given prop name is an angular prop
         * @param propName
         * @returns {*|boolean}
         * @private
         */

        __isNgProp(propName) {
            return this.constructor._ngProperties && this.constructor._ngProperties.hasOwnProperty(propName);
        }

        /**
         * Return true if we should update angular properties
         * @returns {boolean}
         * @private
         */
        __shouldUpdateNgProps(changedProps) {
            if (!this.constructor._ngProperties) {
                return false;
            }
            for (const changedPropKey of changedProps.keys()) {
                if (this.__isNgProp(changedPropKey)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Return a promise that is resolved with angular's parent scope
         * @returns {Promise<any>}
         * @private
         */
        __getNgScope() {
            return new Promise((resolve) => {
                const { angular } = window;
                if (this.__ngScope) {
                    resolve(this.__ngScope);
                }
                let ngScope = angular ? angular.element(this.parentElement).scope() : null;
                if (ngScope) {
                    this.__ngScope = ngScope;
                    resolve(this.__ngScope);
                } else {
                    setTimeout(async () => {
                        ngScope = angular ? angular.element(this.parentElement).scope() : null;
                        if (ngScope) {
                            this.__ngScope = ngScope;
                            // Try to extract angular's $apply, otherwise use setTimeout
                            const $body = angular ? angular.element(
                              document.getElementsByTagName('ng-app')[0] ||
                              document.querySelector("[ng-app]")
                            ) : null;
                            const nextDigest = get($body, 'scope().$root.$apply') || setTimeout;
                            nextDigest(() => {
                                resolve(this.__ngScope);
                            });
                        } else {
                            console.warn(`Angular scope want not found on ${this.constructor.name}`);
                            resolve();
                        }
                    }, SECOND * 0.1);
                }
            });
        }

        /**
         * Commit an update with the scope and the changedProp
         * @param ngScope
         * @param changedProps
         * @private
         */
        __updateWithNgScope(ngScope, changedProps) {
            for (const [ngPropName, ngPropOptions] of Object.entries(this.constructor._ngProperties)) {
                const pathOnScope = this.getAttribute(ngPropName);
                const ngValueOnScope = get(ngScope, pathOnScope);
                if (!ngValueOnScope || typeof ngValueOnScope === 'string') {
                    this[ngPropName] = null;
                    changedProps.delete(ngPropName);
                } else {
                    watchIfNeeded(ngPropOptions, this, ngScope, ngValueOnScope);
                    this[ngPropName] = ngValueOnScope;
                    changedProps.set(ngPropName, ngValueOnScope);
                }
            }
            super.update(changedProps);
        }
    };
};

export default NgLit;
