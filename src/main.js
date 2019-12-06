import {buttonShowMoreTemplate} from './components/button-show-more';
import {createCardFilmTemplate} from './components/card-film.js';
import {contentTemplate} from './components/content.js';
import {extraFilmListTemplate} from './components/extra-film-list.js';
import {filmDetailsTemplate} from './components/film-details';
import {filmsListTemplate} from './components/films-list.js';
import {siteUserProfileTemplate} from './components/user-profile.js';
import {siteNavigationTemplate} from './components/site-navigation.js';
import {sortListTemplate} from './components/sort-list.js';
import {createCommentTemplate} from './components/comment.js';

import {generateFilmCards} from './mock/card.js';
import {generateUserStatus} from './mock/user-status.js';
import {generateNavigation} from './mock/navigation.js';
import {generateComments} from './mock/comments.js';

import {setFilter} from './util.js';
import {clearElements} from './util.js';

const SHOWING_CARD_FILM_COUNT_ON_START = 5;
const SHOWING_CARD_FILM_COUNT_BY_BUTTON = 5;
const RATING_SORT = `Sort by rating`;
const DATE_SORT = `Sort by date`;
const COMMENTS_COUNT_SORT = `Sort by comment count`;
const DEFAULT_SORT = `Sort by default`;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, siteUserProfileTemplate(generateUserStatus()), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, siteNavigationTemplate(generateNavigation()), `beforeend`);
render(siteMainElement, sortListTemplate(), `beforeend`);
render(siteMainElement, contentTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
render(filmsElement, filmsListTemplate(), `beforeend`);

const filmsListElement = siteMainElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);


// создаем карточки фильмов
const defaultSortCards = generateFilmCards();
const popularFilteredCards = setFilter(defaultSortCards, RATING_SORT); // Список карточек отсортированных по рейтингу
const dateFilteredCards = setFilter(defaultSortCards, DATE_SORT); // Список карточек отсортированных по дате
const commentsFilteredCards = setFilter(defaultSortCards, COMMENTS_COUNT_SORT); // Список карточек отсортированных по количеству комментариев

let cards = defaultSortCards;

// Рендерим первые 5 карточек фильмов
let showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
cards.slice(0, showingCardsFilmCount).forEach((generateCard) => render(filmsListContainerElement, createCardFilmTemplate(generateCard), `beforeend`));

render(filmsListElement, buttonShowMoreTemplate(), `beforeend`);


// Показываем скрытые карточки
let loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);
const onClickLoadMoreButton = () => {
  const prevCardFilmCount = showingCardsFilmCount;
  showingCardsFilmCount = showingCardsFilmCount + SHOWING_CARD_FILM_COUNT_BY_BUTTON;

  cards.slice(prevCardFilmCount, showingCardsFilmCount)
    .forEach((generateCard) => render(filmsListContainerElement, createCardFilmTemplate(generateCard), `beforeend`));
  if (showingCardsFilmCount >= cards.length) {
    loadMoreButton.remove();
  }
};

loadMoreButton.addEventListener(`click`, onClickLoadMoreButton);

// Функция переключения сортировки карточек
const sort = siteMainElement.querySelector(`.sort`);

const onSortButton = (evt) => {
  const target = evt.target;
  const allSortButton = sort.querySelectorAll(`.sort__button`);
  const allFilmCards = filmsListContainerElement.querySelectorAll(`.film-card`);

  if (!target.classList.contains(`sort__button--active`)) {
    allSortButton.forEach((it) => {
      if (it.classList.contains(`sort__button--active`)) {
        it.classList.toggle(`sort__button--active`);
      }
    });
    target.classList.toggle(`sort__button--active`);
    clearElements(filmsListContainerElement, allFilmCards);

    switch (target.textContent) {
      case DEFAULT_SORT:
        cards = defaultSortCards;
        break;
      case DATE_SORT:
        cards = dateFilteredCards;
        break;
      case RATING_SORT:
        cards = popularFilteredCards;
        break;
      default:
        break;
    }

    if (showingCardsFilmCount >= cards.length) {
      render(filmsListElement, buttonShowMoreTemplate(), `beforeend`);
      loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);
      loadMoreButton.addEventListener(`click`, onClickLoadMoreButton);
    }

    showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
    cards.slice(0, showingCardsFilmCount).forEach((generateCard) => render(filmsListContainerElement, createCardFilmTemplate(generateCard), `beforeend`));
  }
};

sort.addEventListener(`click`, onSortButton);


// Рендерим самые популярные фильмы
render(filmsElement, extraFilmListTemplate(`Top rated`), `beforeend`);
render(filmsElement, extraFilmListTemplate(`Most commented`), `beforeend`);

const filmsExtraListElements = filmsElement.querySelectorAll(`.films-list--extra`);

const filmsMostRatedContainerElement = filmsExtraListElements[0].querySelector(`.films-list__container`);
popularFilteredCards.slice(0, 2).forEach((generateCard) => render(filmsMostRatedContainerElement, createCardFilmTemplate(generateCard), `beforeend`)); // Рендерим 2 фильма с самым высоким рейтингом
const filmsMostCommentedContainerElement = filmsExtraListElements[1].querySelector(`.films-list__container`);
commentsFilteredCards.slice(0, 2).forEach((generateCard) => render(filmsMostCommentedContainerElement, createCardFilmTemplate(generateCard), `beforeend`)); // Рендерим 2 самых комментируемых фильма

// Рендерим попап с подробными деталями фильма
const footerElement = document.querySelector(`.footer`);
render(footerElement, filmDetailsTemplate(cards[0]), `afterend`);

// Рендерим комментарии
const commentsContainer = document.querySelector(`.film-details__comments-list`);

const commentsList = generateComments(cards[0].commentsCount);
commentsList
  .slice(0, cards[0].commentsCount)
  .forEach((generateComment) => render(commentsContainer, createCommentTemplate(generateComment), `beforeend`));

