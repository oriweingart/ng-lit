import { LitElement, html } from "lit-element";
import { NgLit } from "../index";

export class NgLitUser extends NgLit(LitElement) {
  static get properties() {
    return {
      user: { fromNg: true },
    };
  }

  render() {
    const {
      user
    } = this;

    return html`
              <div>user name in ng-lit: ${`${user.firstName} ${user.lastName}`}</div>
            `;
  }
}
export class NgLitItems extends NgLit(LitElement) {
  static get properties() {
    return {
      items: { fromNg: true },
    };
  }

  render() {
    const {
      items
    } = this;

    return html`
                <div>items in ng-lit:
                    ${(items).map((item) => {
      return html`<span>${item}</span>
                   `;})}
                </div>
            `;
  }
}
export class NgLitUserWithItems extends NgLit(LitElement) {
  static get properties() {
    return {
      user: { fromNg: true },
      items: { fromNg: true },
    };
  }

  render() {
    const {
      user,
      items
    } = this;

    return html`
                <div>user name and items in ng-lit: ${`${user.firstName} ${user.lastName}`}
                    ${(items).map((item) => {
                    return html`<span>${item}</span>
                   `;})}
                </div>
            `;
  }
}




export class NgLitWatchItems extends NgLit(LitElement) {
  static get properties() {
    return {
      items: { fromNg: true, watch: true },
    };
  }

  remove(index) {
    const {
      items = []
    } = this;
    items.splice(index, 1);
  }

  render() {
    const {
      items = []
    } = this;

    return html`
                <div>
                    <h2>Lit Items</h2>
                    ${(items).map((item, index) => {
                      return html`<div>${item}<button @click="${e => this.remove(index)}">remove from lit</button></div>`;
                    })}
                </div>
            `;
  }
}
export class NgLitWatchUser extends NgLit(LitElement) {
  static get properties() {
    return {
      user: { fromNg: true, watch: true },
    };
  }

  render() {
    const {
      user = {}
    } = this;

    return html`
                <h2>Name In Lit Element: ${`${user.firstName  } ${  user.lastName}`}</h2>
            `;
  }
}
export class NgMultiNgPropsElement extends NgLit(LitElement) {
  static get properties() {
    return {
      user: { fromNg: true },
      items: { fromNg: true, watch: true },
    };
  }

  render() {
    const {
      user = {},
      items = []
    } = this;

    return html`
                <div>
                    <h2>Lit Name: ${`${user.firstName  } ${  user.lastName}`}</h2>
                    <h2>Lit Items</h2>
                    ${(items).map((item, index) => {
      return html`<div>${item}</div>`;
    })}
                </div>
            `;
  }
}
