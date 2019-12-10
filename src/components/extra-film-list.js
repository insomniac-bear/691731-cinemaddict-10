import {createElement} from '../util.js';

const extraFilmListTemplate = (name) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${name}</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class ExtraFilmList {
  constructor(name) {
    this._name = name;
    this._element = null;
  }

  getTemplate() {
    return extraFilmListTemplate(this._name);
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
