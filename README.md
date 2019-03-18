### :warning: Under development :hammer_and_wrench:

# 🔌 Boots up your old [AngularJS](https://github.com/angular/angular.js) app with fancy new [litElement](https://github.com/Polymer/lit-element) components.
[![CircleCI](https://circleci.com/gh/oriweingart/ng-lit.svg?style=svg)](https://circleci.com/gh/oriweingart/ng-lit)
[![NPM version](https://badge.fury.io/js/ng-lit.svg)](https://travis-ci.com/oriweingart/ng-lit)


Mixing class to pass angular objects and arrays from [AngularJS](https://github.com/angular/angular.js) application into [lit-element](https://github.com/Polymer/lit-element) without parsing them as json.

## 👩‍🚀 Installing

```bash
npm i -S ng-lit
```


## 👨‍💻 Usage

**[Demo on jsfiddle](https://jsfiddle.net/3jd61yh7/)**

```javascript
// lit component
import { LitElement, html } from "lit-element";
import { NgLit } from "ng-lit";

class NgLitUser extends NgLit(LitElement) {
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
    const { age, user } = this;
    return html`<span>${user.firstName} ${user.lastName} is ${age} years old</span>`;
  }
}
customElements.define('ng-lit-user', NgLitUser);
```

```html
<!-- angular -->
<div ng-app="myApp" 
     ng-controller="myCtrl">
    <ng-lit-user 
       user="ngUser" 
       age="15">
    </ng-lit-user>
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

## 🧙‍♀️ Motivation

`ng-lit` allows you to boots an old [AngularJS](https://github.com/angular/angular.js) application by using [litElement](https://github.com/Polymer/lit-element) components without refactoring the entire app.

This way you can incrementally upgrade the application with new [litElement](https://github.com/Polymer/lit-element) components live side by side with old [AngularJS](https://github.com/angular/angular.js) code, until you can fully drop [AngularJS](https://github.com/angular/angular.js) from the app.

##### Conceptual example
Consider a `todo-app` fully written with [AngularJS](https://github.com/angular/angular.js) composed of 3 components:
```html
<todo-main-app> 
```
 - Main app entry that load a list of `todo` objects to the `$scope`.
```html
<todo-list todos="vm.myTodoList"> 
```    
 - Component that get a list of `todo` objects and and draw `<todo-item>` for each item in the list.
```html
<todo-item todo="vm.singleTodo"> 
```    
 - Component that get a single `todo` object and render it's state (text and isDone checkbox).

Using `ng-lit` you can build a new implementation for `<todo-item>` based on [litElement](https://github.com/Polymer/lit-element) with same interface (given todo object as prop) as your first incremental change:
```html
<lit-todo-item todo="vm.singleTodo"> 
```    
 - Component that get a single `todo` object and render it's state (text and isDone checkbox).

You can stop here or continue with upgrading `<todo-list>` and finally new app entry.

## 🚴 Documentation

### Properties

Props that need to be extracted from angular should be to be added to `ngProps` method.

The following example will fetch `books` list and `selectedBook` object from angular while `userId` will be treated as normal litElement property:
```javascript
  static get properties() {
    return {
      userId: { type: Number },
      books: { type: Array }, 
      selectedBook: { type: Object }
    };
  }
  static get ngProps() {
    return {
      books: { default: [] },
      selectedBook: { default: {} }
    }
  }
```

#### Defaults
use the `default` option to pass a default value in case of angular scope or the value were not found (or `null`).
```javascript
  static get ngProps() {
    return {
      selectedBook: { default: {title: '1984', author: 'George Orwell'} }
    }
  }
```

#### Watch
use the `watch: true` option to make litElement re-render on changes made to the property on angular's code.

The following example will re-render the litElement when `$scope.addBook()` is called:

```javascript
// lit component
class NgListBookList extends NgLit(LitElement) {
  static get properties() {
    return {
      books: { type: Array }
    };
  }
  static get ngProps() {
    return {
      books: { default: [], watch: true }
    }
  }
  render() {
    const { books } = this;
    return html`${books.map(({title, author}) =>html`<li>${title} by ${author}</li>`)}`;
  }
}
customElements.define('ng-lit-books', NgListBookList);
```

```html
<!-- angular -->
<div ng-app="myApp" 
     ng-controller="myCtrl">
    <ng-lit-books 
       books="myBooks">
    </ng-lit-books>
    <button 
        ng-click="addBook({title: 'Anna Karenina', author: 'Leo Tolstoy'})">
        Anna Karenina
    </button>
</div>
<script>
  angular.module('myApp', [])
    .controller('myCtrl', $scope => {
        $scope.myBooks = [];
        $scope.addBook = book => {
            $scope.myBooks.push(book)  
        }
  });
</script>
```
