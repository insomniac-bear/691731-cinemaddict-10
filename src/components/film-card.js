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
  const {comments, filmInfo, userDetails} = card;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(filmInfo.release.date).format(`YYYY`)}</span>
        <span class="film-card__duration">${Math.trunc(filmInfo.runtime / 60)}h ${filmInfo.runtime % 60}m</span>
        <span class="film-card__genre">${filmInfo.genre[0]}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description.length < 140 ? filmInfo.description : `${filmInfo.description.substring(0, 139)}...`}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${createButtonMarkup(`watchlist`, userDetails.isWatchlist)}
        ${createButtonMarkup(`watched`, userDetails.isWatched)}
        ${createButtonMarkup(`favorite`, userDetails.isFavorite)}
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
