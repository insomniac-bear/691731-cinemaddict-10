import {createElement} from '../util.js';

const contentTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class Content {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return contentTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

