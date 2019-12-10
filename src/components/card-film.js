import {createElement} from '../util.js';

const createCardFilmTemplate = (card) => {
  const {img, filmName, filmRating, filmDate, filmDuration, filmStyles, filmDescription, commentsCount} = card;
  const generes = Array.from(filmStyles);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${filmName}</h3>
      <p class="film-card__rating">${filmRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmDate.year}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${generes[0]}</span>
      </p>
      <img src="${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class CardFilm {
  constructor(card) {
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createCardFilmTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this.Element = null;
  }
}
