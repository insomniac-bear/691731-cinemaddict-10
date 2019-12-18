import FilmsComponent from './components/films.js';
import FooterComponent from './components/footer-statistic.js';
import PageController from './controllers/page-controller.js';
import UserProfileComponent from './components/user-profile.js';
import SiteNavigationComponent from './components/site-navigation.js';
import SortListComponent from './components/sort-list.js';

import {generateFilmCards} from './mock/card.js';
import {generateNavigation} from './mock/navigation.js';

import {render, RenderPosition} from './utils/render.js';

// Рендерим основную разметку сайта
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserProfileComponent(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
const navigation = generateNavigation();
render(siteMainElement, new SiteNavigationComponent(navigation), RenderPosition.BEFOREEND);
render(siteMainElement, new SortListComponent(), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND); // Рендерим элемент films где размещаются все списки фильмов если фильмы есть и сообщение заглушка, если фильмов - нет

// создаем карточки фильмов
const cards = generateFilmCards();

const pageController = new PageController(filmsComponent);

pageController.render(cards);

const footerContainer = document.querySelector(`.footer`);
render(footerContainer, new FooterComponent(cards.length), RenderPosition.BEFOREEND);

// Функция переключения сортировки карточек
/* const sort = siteMainElement.querySelector(`.sort`);

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
        render(filmsListComponent.getElement(), buttonShowMoreComponent, RenderPosition.BEFOREEND);
        buttonShowMoreComponent.setClickHandler(onClickLoadMoreButton);
      }

      showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
      cards.slice(0, showingCardsFilmCount).forEach((generateCard) => {
        renderCard(generateCard, filmsListContainerElement);
      });
    }
  };


  sort.addEventListener(`click`, onSortButton);*/
