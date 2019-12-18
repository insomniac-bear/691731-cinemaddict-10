import AbstractComponent from './abstract-component.js';

const extraFilmListTemplate = (name) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${name}</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class ExtraFilmList extends AbstractComponent {
  constructor(name) {
    super();

    this._name = name;
  }

  getTemplate() {
    return extraFilmListTemplate(this._name);
  }
}
