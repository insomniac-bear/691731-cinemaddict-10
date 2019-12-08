import ButtonShowMoreComponent from './components/button-show-more';
import CardFilmComponent from './components/card-film.js';
import ContentComponent from './components/content.js';
import ExtraFilmListComponent from './components/extra-film-list.js';
import FilmDetailsComponent from './components/film-details';
import FilmsListComponent from './components/films-list.js';
import UserProfileComponent from './components/user-profile.js';
import SiteNavigationComponent from './components/site-navigation.js';
import SortListComponent from './components/sort-list.js';

import {generateFilmCards} from './mock/card.js';
import {generateNavigation} from './mock/navigation.js';

import {setFilter} from './util.js';
import {clearElements} from './util.js';
import {render, RenderPosition} from './util.js';

const SHOWING_CARD_FILM_COUNT_ON_START = 5;
const SHOWING_CARD_FILM_COUNT_BY_BUTTON = 5;
const RATING_SORT = `Sort by rating`;
const DATE_SORT = `Sort by date`;
const COMMENTS_COUNT_SORT = `Sort by comment count`;
const DEFAULT_SORT = `Sort by default`;

const renderCard = (card, parrentNode) => {
  const cardComponent = new CardFilmComponent(card);
  const filmDetailsComponent = new FilmDetailsComponent(card);

  const cardPoster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitle = cardComponent.getElement().querySelector(`.film-card__title`);
  const cardComments = cardComponent.getElement().querySelector(`.film-card__comments`);
  const btnCloseCardDetails = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  // Функция открытия попапа с полной информацией о фильме
  const onClickFilmDetailsOpen = (evt) => {
    evt.preventDefault();
    const popupPlace = document.querySelector(`body`);

    render(popupPlace, filmDetailsComponent.getElement(), RenderPosition.BEFOREEND);
  };

  // Функция удаления попапа с информацией о фильме из DOM-дерева
  const onClickBtnCloseCardDetails = () => {
    filmDetailsComponent.getElement().remove();
  };

  cardPoster.addEventListener(`click`, onClickFilmDetailsOpen);
  cardTitle.addEventListener(`click`, onClickFilmDetailsOpen);
  cardComments.addEventListener(`click`, onClickFilmDetailsOpen);

  btnCloseCardDetails.addEventListener(`click`, onClickBtnCloseCardDetails);

  render(parrentNode, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserProfileComponent().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
const navigation = generateNavigation();
render(siteMainElement, new SiteNavigationComponent(navigation).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortListComponent().getElement(), RenderPosition.BEFOREEND);

const contentComponent = new ContentComponent();
render(siteMainElement, contentComponent.getElement(), RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListComponent = new FilmsListComponent();
render(filmsElement, filmsListComponent.getElement(), RenderPosition.BEFOREEND);

const filmsListElement = siteMainElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsListComponent.getElement().querySelector(`.films-list__container`);


// создаем карточки фильмов
const defaultSortCards = generateFilmCards();
const popularFilteredCards = setFilter(defaultSortCards, RATING_SORT); // Список карточек отсортированных по рейтингу
const dateFilteredCards = setFilter(defaultSortCards, DATE_SORT); // Список карточек отсортированных по дате
const commentsFilteredCards = setFilter(defaultSortCards, COMMENTS_COUNT_SORT); // Список карточек отсортированных по количеству комментариев

let cards = defaultSortCards;

// Рендерим первые 5 карточек фильмов
let showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
cards.slice(0, showingCardsFilmCount).forEach((generateCard) => {
  renderCard(generateCard, filmsListContainerElement);
});

const buttonShowMoreComponent = new ButtonShowMoreComponent();
render(filmsListElement, buttonShowMoreComponent.getElement(), RenderPosition.BEFOREEND);


// Показываем скрытые карточки
const onClickLoadMoreButton = () => {
  const prevCardFilmCount = showingCardsFilmCount;
  showingCardsFilmCount = showingCardsFilmCount + SHOWING_CARD_FILM_COUNT_BY_BUTTON;

  cards.slice(prevCardFilmCount, showingCardsFilmCount)
    .forEach((generateCard) => {
      renderCard(generateCard, filmsListContainerElement);
    });
  if (showingCardsFilmCount >= cards.length) {
    buttonShowMoreComponent.getElement().remove();
    buttonShowMoreComponent.removeElement();
  }
};

buttonShowMoreComponent.getElement().addEventListener(`click`, onClickLoadMoreButton);

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
      render(filmsListElement, buttonShowMoreComponent.getElement(), RenderPosition.BEFOREEND);
      buttonShowMoreComponent.getElement().addEventListener(`click`, onClickLoadMoreButton);
    }

    showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
    cards.slice(0, showingCardsFilmCount).forEach((generateCard) => {
      renderCard(generateCard, filmsListContainerElement);
    });
  }
};

sort.addEventListener(`click`, onSortButton);

// Рендерим самые популярные фильмы
render(filmsElement, new ExtraFilmListComponent(`Top rated`).getElement(), RenderPosition.BEFOREEND);
render(filmsElement, new ExtraFilmListComponent(`Most commented`).getElement(), RenderPosition.BEFOREEND);

const filmsExtraListElements = filmsElement.querySelectorAll(`.films-list--extra`);

const filmsMostRatedContainerElement = filmsExtraListElements[0].querySelector(`.films-list__container`);
popularFilteredCards.slice(0, 2).forEach((generateCard) => {
  renderCard(generateCard, filmsMostRatedContainerElement); // Рендерим 2 фильма с самым высоким рейтингом
});
const filmsMostCommentedContainerElement = filmsExtraListElements[1].querySelector(`.films-list__container`);
commentsFilteredCards.slice(0, 2).forEach((generateCard) => {
  renderCard(generateCard, filmsMostCommentedContainerElement); // Рендерим 2 самых комментируемых фильма
});
