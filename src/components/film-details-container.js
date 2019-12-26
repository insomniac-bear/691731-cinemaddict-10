import AbstractComponent from './abstract-component.js';

const createFilmDetailsContainerMarkup = () => {
  return (
    `<section class="film-details">
    </section>`
  );
};

export default class FilmDetailsContainer extends AbstractComponent {
  getTemplate() {
    return createFilmDetailsContainerMarkup();
  }
}
