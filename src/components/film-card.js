import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const createButtonMarkup = (name, isActive) => {
  const selectStyle = (nameButton) => {
    let styleName = ``;

    switch (nameButton) {
      case `watchlist`:
        styleName = `add-to-watchlist`;
        break;
      case `watched`:
        styleName = `mark-as-watched`;
        break;
      case `favorite`:
        styleName = `favorite`;
        break;

      default:
        break;
    }

    return styleName;
  };

  return (
    `<button 
      class="film-card__controls-item
      button
      film-card__controls-item--${selectStyle(name)}
      ${isActive ? `film-card__controls-item--active` : ``}">
      Add to ${name}
    </button>`
  );
};

const createCardFilmTemplate = (card) => {
  const {img, filmName, filmRating, filmDate, filmDuration, filmStyles, filmDescription, isWatchList, isWatched, isFavorite, commentsCount} = card;
  const generes = Array.from(filmStyles);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${filmName}</h3>
      <p class="film-card__rating">${filmRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(filmDate).format(`YYYY`)}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${generes[0]}</span>
      </p>
      <img src="${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${createButtonMarkup(`watchlist`, isWatchList)}
        ${createButtonMarkup(`watched`, isWatched)}
        ${createButtonMarkup(`favorite`, isFavorite)}
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(card) {
    super();

    this._card = card;
  }

  getTemplate() {
    return createCardFilmTemplate(this._card);
  }

  setOpenDetailsButtonsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setWatchListButton(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButton(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButton(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
