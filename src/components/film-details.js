import AbstractSmartComponent from './abstract-smart-component.js';
import {EmojiUrl} from '../const.js';
import moment from 'moment';
import he from 'he';

const generateFilmGenere = (generes) => {
  return generes
    .map((genere) => {
      return (`<span class="film-details__genre">${genere}</span>`);
    })
    .join(`\n`);
};

const parseFormData = (formData) => {
  return {
    textComment: formData.get(`comment`),
    date: new Date(),
    author: `user`,
    emoji: formData.get(`comment-emoji`),
  };
};

const createCommentMarkup = (comment, index) => {
  const {textComment, date, author, emoji} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${EmojiUrl[emoji.toUpperCase()]}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(textComment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${moment(date).format(`YYYY/MM/DD HH:MM`)}</span>
          <button
            class="film-details__comment-delete"
            id="${index}">
            Delete
          </button>
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
    .map((comment, index) => {
      return createCommentMarkup(comment, index);
    })
    .join(`\n`);
};

const createFilmDetailsTemplate = (card, emojiComment = {}) => {
  const {filmName, img, filmRating, filmDate, filmDuration, filmStyles, filmDescription, isWatchlist, isWatched, isFavorite, comments} = card;
  const {isEmoji, emojiUrl, emojiName} = emojiComment;

  const generes = generateFilmGenere(Array.from(filmStyles));
  const commentsList = generateCommentsList(comments);

  return (
    `<form class="film-details__inner" action="" method="get">
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
                <td class="film-details__cell">${moment(filmDate).format(`DD MMMM YYYY`)}</td>
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
          ${createCheckboxMarkup(`watchlist`, isWatchlist)}
          ${createCheckboxMarkup(`watched`, isWatched)}
          ${createCheckboxMarkup(`favorite`, isFavorite)}
        </section>
      </div>
      ${isWatched ? createFilmDetailsReitingMarkup(img, filmName) : ``}
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
          ${commentsList.length > 0 ? commentsList : ``}
          </ul>
          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
              ${isEmoji ? `<img src="${emojiUrl}" width="55" height="55" alt="emoji">` : ``}
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write commenthere" name="comment"></textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"id="emoji-smile" value="smile" ${emojiName === `smile` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"id="emoji-sleeping" value="sleeping" ${emojiName === `sleeping` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"id="emoji-gpuke" value="gpuke" ${emojiName === `gpuke` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-gpuke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"id="emoji-angry" value="angry" ${emojiName === `angry` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(card) {
    super();

    this._card = card;

    this._emojiInComment = {
      isEmoji: false,
      emojiUrl: null,
    };
    this._closeHandler = null;
    this._deleteCommentHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._card, this._emojiInComment);
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeHandler);
    this.setDeleteCommentButtonsClickHandler(this._deleteCommentHandler);
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
        this._card.isWatchlist = !this._card.isWatchlist;
      });

    element.querySelector(`#watched`)
      .addEventListener(`change`, () => {
        this._card.isWatched = !this._card.isWatched;

        this.rerender();
      });

    element.querySelector(`#favorite`)
      .addEventListener(`change`, () => {
        this._card.isFavorite = !this._card.isFavorite;
      });

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, (evt) => {
        // evt.preventDefault();
        const target = evt.target;
        if (target.getAttribute(`alt`) === `emoji`) {
          const emojiId = target.parentNode.getAttribute(`for`);
          const emojiInput = document.getElementById(emojiId);
          this._emojiInComment.isEmoji = true;
          this._emojiInComment.emojiUrl = EmojiUrl[emojiInput.value.toUpperCase()];
          this._emojiInComment.emojiName = emojiInput.value;
          this.rerender();
        }
      });
  }

  setDeleteCommentButtonsClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.classList.contains(`film-details__comment-delete`)) {
          const commentIndex = evt.target.id;
          handler(commentIndex);
          this.rerender();
        }
      });
    this._deleteCommentHandler = handler;
  }

  setSubmitCommentHandler() {
    document.addEventListener(`keydown`, (evt) => {
      const form = this.getElement();

      if (evt.key === `Control`) {
        document.addEventListener(`keyup`, (evtSecond) => {
          if (evtSecond.key === `Enter`) {
            evt.preventDefault();
            const formData = new FormData(form);
            const newComment = parseFormData(formData);
            this._card.comments.push(newComment);
            this.rerender();
          }
        });
      }
    });
  }

  getData() {
    return this._card;
  }
}
