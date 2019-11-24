import {buttonShowMoreTemplate} from './components/button-show-more';
import {cardFilmTemplate} from './components/card-film.js';
import {contentTemplate} from './components/content.js';
import {extraFilmListTemplate} from './components/extra-film-list.js';
import {filmDetailsTemplate} from './components/film-details';
import {filmsListTemplate} from './components/films-list.js';
import {siteUserProfileTemplate} from './components/user-profile.js';
import {siteNavigationTemplate} from './components/site-navigation.js';
import {sortListTemplate} from './components/sort-list.js';

const TASK_COUNT = 5;
const TASK_COUNT_EXTRA = 2;

const extraHeads = [`<h2 class="films-list__title">Top rated</h2>`, `<h2 class="films-list__title">Most commented</h2>`];

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, siteUserProfileTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, siteNavigationTemplate(), `beforeend`);
render(siteMainElement, sortListTemplate(), `beforeend`);
render(siteMainElement, contentTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);

render(filmsElement, filmsListTemplate(), `beforeend`);

const filmsListElement = siteMainElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

new Array(TASK_COUNT)
  .fill(``)
  .forEach(
      () => render(filmsListContainerElement, cardFilmTemplate(), `beforeend`)
  );

render(filmsListElement, buttonShowMoreTemplate(), `beforeend`);

new Array(TASK_COUNT_EXTRA)
.fill(``)
.forEach(
    () => render(filmsElement, extraFilmListTemplate(), `beforeend`)
);

const filmsExtraListElements = siteMainElement.querySelectorAll(`.films-list--extra`);

for (let i = 0; i < filmsExtraListElements.length; i++) {
  render(filmsExtraListElements[i], extraHeads[i], `afterbegin`);
  const filmsContainerElement = filmsExtraListElements[i].querySelector(`.films-list__container`);
  new Array(TASK_COUNT_EXTRA)
    .fill(``)
    .forEach(
        () => render(filmsContainerElement, cardFilmTemplate(), `beforeend`)
    );
}

const footerElement = document.querySelector(`.footer`);
render(footerElement, filmDetailsTemplate(), `afterend`);
