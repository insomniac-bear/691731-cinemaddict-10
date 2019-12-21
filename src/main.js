import FooterComponent from './components/footer-statistic.js';
import PageController from './controllers/page-controller.js';
import UserProfileComponent from './components/user-profile.js';

import {generateFilmCards} from './mock/card.js';

import {render, RenderPosition} from './utils/render.js';

// Рендерим основную разметку сайта
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserProfileComponent(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

// создаем карточки фильмов
const cards = generateFilmCards();

const pageController = new PageController(siteMainElement); // Подключаем контроллер

pageController.render(cards);

const footerContainer = document.querySelector(`.footer`);
render(footerContainer, new FooterComponent(cards.length), RenderPosition.BEFOREEND);
