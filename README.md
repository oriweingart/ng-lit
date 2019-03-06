### :warning: Under development :hammer_and_wrench:

# Pass objects and arrays from AngularJS scope to LitElement
[![CircleCI](https://circleci.com/gh/oriweingart/ng-lit.svg?style=svg)](https://circleci.com/gh/oriweingart/ng-lit)
[![NPM version](https://badge.fury.io/js/ng-lit.svg)](https://travis-ci.com/oriweingart/ng-lit)


Mixing class to pass angular objects and arrays from [AngularJS](https://github.com/angular/angular.js) application into [lit-element](https://github.com/Polymer/lit-element) without parsing them as json.

## Install

```bash
npm install ng-lit
```


## Simple usage

#### LitElement
```javascript
import { LitElement, html } from "lit-element";
import { NgLit } from "ng-lit";

export class NgLitUser extends NgLit(LitElement) {
  static get properties() {
    return {
      age: { type: Number },
      user: { type: Object }
    };
  }
  // declare the angular props
  static get ngProps() {
    return {
      user: { default: {} }
    }
  }
  render() {
    const {
      age,
      user
    } = this;

    return html`<h2>First Name: ${user.firstName} Last Name: ${user.lastName} Age: ${age}</h2>`;
  }
}
customElements.define('ng-lit-user', NgLitUser);
```

#### angular controller
```html
<div ng-app="myApp" 
     ng-controller="myCtrl">
    <ng-lit-user 
       user="ngUser" 
       age="15">
    </nglit-user>
</div>
<script>
  angular.module('myApp', [])
    .controller('myCtrl', $scope => {
        $scope.ngUser = {
          firstName: "John",
          lastName: "Doe"
        };
  });
</script>
```
