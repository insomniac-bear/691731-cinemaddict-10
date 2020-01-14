import AbstractSmartComponent from './abstract-smart-component.js';
import {EmojiUrl} from '../const.js';
import moment from 'moment';
import he from 'he';

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
    `<input type="checkbox"
      class="film-details__control-input visually-hidden"
      id="${name}" name="${name}"
      ${isChecked ? `checked` : ``}>
    <label for="${name}" class="film-details__control-label film-details__control-label--${name}">Add to ${name}</label>`
  );
};

const createRatingRadioButtonMarkup = (score, isActive) => {
  return (
    `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${score}" id="rating-${score}" ${isActive ? `checked` : ``}>
    <label class="film-details__user-rating-label" for="rating-${score}">${score}</label>`
  );
};

const createRatingButtons = (rating) => {
  return SCORES.map((it) => {
    return createRatingRadioButtonMarkup(it, it === rating);
  });
};

const createFilmDetailsReitingMarkup = (poster, title, rating) => {
  return (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              
              ${createRatingButtons(rating)}

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

const createFilmDetailsTemplate = (card, commentsList, emojiComment = {}) => {
  const {comments, filmInfo, userDetails} = card;
  const {isEmoji, emojiUrl, emojiName} = emojiComment;

  const commentsMarckup = generateCommentsList(commentsList);

  return (
    `<form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${filmInfo.poster}" alt="${filmInfo.title}">
            <p class="film-details__age">${filmInfo.ageRating}</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.totalRating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(filmInfo.release.date).format(`DD MMMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${Math.trunc(filmInfo.runtime / 60)}h ${filmInfo.runtime % 60}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${filmInfo.genre.length > 1 ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                  ${filmInfo.genre}
              </tr>
            </table>
            <p class="film-details__film-description">
              ${filmInfo.description}
            </p>
          </div>
        </div>
        <section class="film-details__controls">
          ${createCheckboxMarkup(`watchlist`, userDetails.isWatchlist)}
          ${createCheckboxMarkup(`watched`, userDetails.isWatched)}
          ${createCheckboxMarkup(`favorite`, userDetails.isFavorite)}
        </section>
      </div>
      ${userDetails.isWatched ? createFilmDetailsReitingMarkup(filmInfo.poster, filmInfo.title, userDetails.personalRating) : ``}
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
          ${commentsList.length > 0 ? commentsMarckup() : ``}
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
  constructor(card, commentsList) {
    super();

    this._card = card;
    this._comments = commentsList;

    this._emojiInComment = {
      isEmoji: false,
      emojiUrl: null,
    };

    this._closeHandler = null;
    this._deleteCommentHandler = null;
    this._watchlistHandler = null;
    this._watchedHandler = null;
    this._favoriteHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._card, this._comments, this._emojiInComment);
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeHandler);
    this.setDeleteCommentButtonsClickHandler(this._deleteCommentHandler);
    this.setWatchlistHandler(this._watchlistHandler);
    this.setWatchedHandler(this._watchedHandler);
    this.setFavoriteHandler(this._favoriteHandler);
    this._subscribeOnEvents();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._closeHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, (evt) => {
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

  setWatchlistHandler(handler) {
    this.getElement()
      .querySelector(`#watchlist`)
      .addEventListener(`change`, handler);

    this._watchlistHandler = handler;
  }

  setWatchedHandler(handler) {
    this.getElement()
      .querySelector(`#watched`)
      .addEventListener(`change`, () => {
        handler();
        this.rerender();
      });

    this._watchedHandler = handler;
  }

  setFavoriteHandler(handler) {
    this.getElement()
      .querySelector(`#favorite`)
      .addEventListener(`change`, handler);

    this._favoriteHandler = handler;
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

      if (evt.key === `Control` || evt.key === `Command`) {
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
