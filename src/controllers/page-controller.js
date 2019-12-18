import ButtonShowMoreComponent from '../components/button-show-more.js';
import CardFilmComponent from '../components/card-film.js';
import ExtraFilmsListComponent from '../components/extra-film-list.js';
import FilmsComponent from '../components/films.js';
import FilmDetailsComponent from '../components/film-details.js';
import FilmsListComponent from '../components/films-list.js';
import NoCardsComponent from '../components/no-cards.js';
import SiteNavigationComponent from '../components/site-navigation.js';
import SortListComponent, {SortType} from '../components/sort-list.js';

import {generateNavigation} from '../mock/navigation.js';

import {render, RenderPosition, remove} from '../utils/render.js';

const ExtraFilmType = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};

const SHOWING_CARD_FILM_COUNT_ON_START = 5;
const SHOWING_CARD_FILM_COUNT_BY_BUTTON = 5;

// Функция отрисовки карточки фильма
const renderCard = (cardListElement, card) => {
  const cardComponent = new CardFilmComponent(card);

  // Функция открытия попапа с полной информацией о фильме
  const onClickFilmDetailsOpen = () => {
    const popupPlace = document.querySelector(`body`);
    const filmDetailsComponent = new FilmDetailsComponent(card);

    render(popupPlace, filmDetailsComponent, RenderPosition.BEFOREEND);

    // Функция удаления попапа с информацией о фильме из DOM-дерева
    const onClickBtnCloseCardDetails = () => {
      remove(filmDetailsComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        onClickBtnCloseCardDetails();
      }
    };

    filmDetailsComponent.setCloseButtonClickHandler(onClickBtnCloseCardDetails);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  cardComponent.setOpenDetailsButtonsClickHandler(onClickFilmDetailsOpen);

  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

// Функция отрисовки списка карточек
const renderCardsList = (cardsListElement, cards) => {
  cards.forEach((card) => {
    renderCard(cardsListElement, card);
  });
};

// Функция сортировки
const setFilter = (array, value) => {
  const filteredArray = array.slice();

  switch (value) {
    case `date`:
      filteredArray.sort((a, b) => {
        if (b.filmDate.year - a.filmDate.year === 0 && b.filmDate.month - a.filmDate.month !== 0) {
          return b.filmDate.month - a.filmDate.month;
        } else if (b.filmDate.year - a.filmDate.year === 0 && b.filmDate.month - a.filmDate.month === 0) {
          return b.filmDate.day - a.filmDate.day;
        } else {
          return b.filmDate.year - a.filmDate.year;
        }
      });
      break;
    case `rating`:
      filteredArray.sort((a, b) => {
        if (b.filmRating - a.filmRating === 0) {
          return b.coomentsCount - a.commentsCount;
        } else {
          return b.filmRating - a.filmRating;
        }
      });
      break;
    case `comments`:
      filteredArray.sort((a, b) => {
        if (b.commentsCount - a.commentsCount === 0) {
          return b.filmRating - a.filmRating;
        } else {
          return b.commentsCount - a.commentsCount;
        }
      });
      break;
    default:
      break;
  }

  return filteredArray;
};

// Тело контроллера
export default class PageController {
  constructor(container) {
    this._container = container;

    this._buttonShowMoreComponent = new ButtonShowMoreComponent();
    this._cardFilmComponent = new CardFilmComponent();
    this._filmsComponent = new FilmsComponent();
    this._filmDetailsComponent = new FilmDetailsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._mostCommentedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.MOST_COMMENTED);
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortListComponent();
    this._topRatedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.TOP_RATED);
  }


  render(cards) {
    const renderLoadMoreButton = () => {
      if (showingCardsFilmCount >= cards.length) {
        return;
      }

      render(this._filmsListComponent.getElement(), this._buttonShowMoreComponent, RenderPosition.BEFOREEND);

      this._buttonShowMoreComponent.setClickHandler(() => {
        const prevCardFilmCount = showingCardsFilmCount;
        showingCardsFilmCount = showingCardsFilmCount + SHOWING_CARD_FILM_COUNT_BY_BUTTON;

        renderCardsList(filmsListContainerElement, cards.slice(prevCardFilmCount, showingCardsFilmCount));

        if (showingCardsFilmCount >= cards.length) {
          remove(this._buttonShowMoreComponent);
        }
      });
    };

    const navigation = generateNavigation();

    const container = this._container;

    render(container, new SiteNavigationComponent(navigation), RenderPosition.BEFOREEND);
    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    render(container, this._filmsComponent, RenderPosition.BEFOREEND); // Рендерим элемент films где размещаются все списки фильмов если фильмы есть и сообщение заглушка, если фильмов - нет

    // Проверяем, есть ли фильмы в базе
    const isFilmCardsEmpty = (cards.length === 0) ? true : false;


    if (isFilmCardsEmpty) {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND); // Если массив карточек пуст - рендерим сообщение-заглушку
      return;
    }

    render(this._filmsComponent.getElement(), this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    const filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    // Рендерим первые 5 карточек фильмов
    let showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
    renderCardsList(filmsListContainerElement, cards.slice(0, showingCardsFilmCount));

    render(this._filmsListComponent.getElement(), this._buttonShowMoreComponent, RenderPosition.BEFOREEND);
    renderLoadMoreButton();

    const popularFilteredCards = setFilter(cards, SortType.RATING); // Список карточек отсортированных по рейтингу
    const commentsFilteredCards = setFilter(cards, SortType.COMMENTS); // Список карточек отсортированных по количеству комментариев

    popularFilteredCards.slice(0, 2).forEach((generateCard) => {
      renderCard(this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`), generateCard); // Рендерим 2 фильма с самым высоким рейтингом
    });

    commentsFilteredCards.slice(0, 2).forEach((generateCard) => {
      renderCard(this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`), generateCard); // Рендерим 2 самых комментируемых фильма
    });

    // Подключаем переключатель сортировки
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = setFilter(cards, sortType);

      filmsListContainerElement.innerHTML = ``;
      remove(this._buttonShowMoreComponent);

      renderCardsList(filmsListContainerElement, sortedCards.slice(0, showingCardsFilmCount));
      renderLoadMoreButton();
    });
  }
}
