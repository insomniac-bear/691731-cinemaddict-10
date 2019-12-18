import AbstractComponent from './abstract-component.js';

const buttonShowMoreTemplate = () => {
  return (`<button class="films-list__show-more">Show more</button>`);
};

export default class ButtonShowMore extends AbstractComponent {
  getTemplate() {
    return buttonShowMoreTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
