import AbstractSmartComponent from './abstract-smart-component.js';
import {generateComments} from '../mock/comments.js';

const MONTH_NAME = [
  `Janury`, `Febrary`, `March`, `April`, `May`, `June`, `Julay`, `August`, `September`, `October`, `November`, `December`
];

const generateFilmGenere = (generes) => {
  return generes
    .map((genere) => {
      return (`<span class="film-details__genre">${genere}</span>`);
    })
    .join(`\n`);
};

const createCommentMarkup = (comment) => {
  const {textComment, date, author, emoji} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emoji}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${textComment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCheckboxMarkup = (name, isChecked) => {
  return (
    `<input
      type="checkbox"
      class="film-details__control-input visually-hidden"
      id="${name}" name="${name}"
      ${isChecked ? `checked` : ``}>
    <label for="${name}" class="film-details__control-label film-details__control-label--${name}">Add to ${name}</label>`
  );
};

const createFilmDetailsReitingMarkup = (img, filmName) => {
  return (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${img}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${filmName}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
              <label class="film-details__user-rating-label" for="rating-1">1</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
              <label class="film-details__user-rating-label" for="rating-2">2</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
              <label class="film-details__user-rating-label" for="rating-3">3</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
              <label class="film-details__user-rating-label" for="rating-4">4</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
              <label class="film-details__user-rating-label" for="rating-5">5</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
              <label class="film-details__user-rating-label" for="rating-6">6</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
              <label class="film-details__user-rating-label" for="rating-7">7</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
              <label class="film-details__user-rating-label" for="rating-8">8</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
              <label class="film-details__user-rating-label" for="rating-9">9</label>

            </div>
          </section>
        </div>
      </section>
    </div>`
  );
};

const generateCommentsList = (comments) => {
  return comments
    .map((comment) => {
      return createCommentMarkup(comment);
    })
    .join(`\n`);
};

const createFilmDetailsTemplate = (card, options = {}) => {
  const {filmName, img, filmRating, filmDate, filmDuration, filmStyles, filmDescription, commentsCount} = card;
  const {isWatchList, isWatched, isFavorite} = options;

  const generes = generateFilmGenere(Array.from(filmStyles));
  const comments = generateCommentsList(generateComments(commentsCount));

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${img}" alt="">

              <p class="film-details__age">18+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmName}</h3>
                  <p class="film-details__title-original">Original: ${filmName}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">Anthony Mann</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${filmDate.day} ${MONTH_NAME[filmDate.month]} ${filmDate.year}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${filmDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">USA</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${generes.length === 1 ? `Genere` : `Generes`}</td>
                  <td class="film-details__cell">
                    ${generes}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmDescription}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${createCheckboxMarkup(`watchlist`, isWatchList)}
            ${createCheckboxMarkup(`watched`, isWatched)}
            ${createCheckboxMarkup(`favorite`, isFavorite)}
          </section>
        </div>

        ${isWatched ? createFilmDetailsReitingMarkup(img, filmName) : ``}

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">
            ${comments}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here"    name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile"    value="sleeping">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping"     value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke"    value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry"    value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(card) {
    super();

    this._card = card;
    this._isFavorite = card.isFavorite;
    this._isWatchList = card.isWatchList;
    this._isWatched = card.isWatched;

    this._closeHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._card, {
      isWatchList: this._isWatchList,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
    });
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeHandler);
    this._subscribeOnEvents();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._closeHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`#watchlist`)
      .addEventListener(`change`, () => {
        this._isWatchList = !this._isWatchList;
        this.rerender();
      });

    element.querySelector(`#watched`)
      .addEventListener(`change`, () => {
        this._isWatched = !this._isWatched;
        this.rerender();
      });

    element.querySelector(`#favorite`)
      .addEventListener(`change`, () => {
        this._isFavorite = !this._isFavorite;
        this.rerender();
      });
  }
}
